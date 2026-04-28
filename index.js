const { connectRabbitMQ } = require('./src/config/rabbitmq');
const { handleOrderNotification } = require('./src/workers/order.worker');

const QUEUE_NAME = 'order_notifications';

const { register } = require('./src/config/metrics');
const express = require('express');

const start = async () => {
  try {
    console.log('🚀 Starting Notification Service...');
    
    // 1. Start Metrics/Health Server
    const app = express();
    app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));
    app.get('/metrics', async (req, res) => {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    });
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`📊 Metrics & Health server running on port ${PORT}`);
    });

    // 2. Connect to RabbitMQ and start consuming
    console.log('🔌 Connecting to RabbitMQ...');
    await connectRabbitMQ(QUEUE_NAME, handleOrderNotification);
    
  } catch (err) {
    console.error('❌ Notification Service startup failed:', err.message);
    process.exit(1);
  }
};

start();
