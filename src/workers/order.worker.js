const emailService = require('../services/email.service');
const { mqMessageCounter } = require('../config/metrics');

const handleOrderNotification = async (data) => {
  try {
    let info;
    if (data.event === 'ORDER_PLACED' && data.userEmail) {
      info = await emailService.sendOrderConfirmation(data.userEmail, data.orderId, data.order);
      console.log(`[Email Sent to Customer] ID: ${info.messageId}`);
    } 
    else if (data.event === 'NOTIFY_RETAILER' && data.email) {
      info = await emailService.sendFulfillmentRequest(data.email, data.order);
      console.log(`[Email Sent to Retailer] ID: ${info.messageId}`);
    }
    else if (data.event === 'NOTIFY_CUSTOMER' && data.email) {
      info = await emailService.sendStatusUpdate(data.email, data.order);
      console.log(`[Email Sent to Customer] ID: ${info.messageId}`);
    }
    mqMessageCounter.labels(data.event || 'UNKNOWN', 'success').inc();
  } catch (error) {
    console.error('❌ Failed to process order notification:', error.message);
    mqMessageCounter.labels(data.event || 'UNKNOWN', 'failure').inc();
  }
};

module.exports = { handleOrderNotification };
