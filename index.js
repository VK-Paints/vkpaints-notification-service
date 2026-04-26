const { connectRabbitMQ } = require('./src/config/rabbitmq');
const { handleOrderNotification } = require('./src/workers/order.worker');

const QUEUE_NAME = 'order_notifications';

const start = async () => {
  try {
    console.log('🚀 Starting Notification Service...');
    
    // Connect to RabbitMQ and start consuming
    await connectRabbitMQ(QUEUE_NAME, handleOrderNotification);
    
  } catch (err) {
    console.error('❌ Notification Service startup failed:', err.message);
    process.exit(1);
  }
};

start();
