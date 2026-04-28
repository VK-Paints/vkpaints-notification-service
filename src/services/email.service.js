const transporter = require('../config/mail');

const formatOrderItemsHtml = (order) => {
  if (!order.items) return '<p>Legacy order (no item details)</p>';
  const itemsHtml = order.items.map(item => `<li>${item.name} - ${item.liters} L (₹${item.cost})</li>`).join('');
  return `<ul>${itemsHtml}</ul>
          <p><strong>Total Cost:</strong> ₹${order.total_cost}</p>
          <p><strong>Labour Requested:</strong> ${order.requires_labour ? 'Yes' : 'No'}</p>`;
};

const sendOrderConfirmation = async (email, orderId, orderData) => {
  return transporter.sendMail({
    from: '"VK Paints" <no-reply@vkpaints.com>',
    to: email,
    subject: `Order Confirmation - #${orderId}`,
    html: `<h3>Thank you for your order!</h3>
           <p>Your order #${orderId} has been successfully placed.</p>
           ${formatOrderItemsHtml(orderData)}`
  });
};

const sendFulfillmentRequest = async (email, orderData) => {
  return transporter.sendMail({
    from: '"VK Paints Admin" <admin@vkpaints.com>',
    to: email,
    subject: `New Fulfillment Request - Order #${orderData.id}`,
    html: `<h3>New Order Fulfillment</h3>
           <p>Please prepare the following items for Order #${orderData.id}:</p>
           ${formatOrderItemsHtml(orderData)}`
  });
};

const sendStatusUpdate = async (email, orderData) => {
  return transporter.sendMail({
    from: '"VK Paints" <no-reply@vkpaints.com>',
    to: email,
    subject: `Order Update - #${orderData.id}`,
    html: `<h3>Update on your Order #${orderData.id}</h3>
           <p>Your order status has been updated to: <strong>${orderData.status}</strong></p>
           ${formatOrderItemsHtml(orderData)}`
  });
};

module.exports = {
  sendOrderConfirmation,
  sendFulfillmentRequest,
  sendStatusUpdate
};
