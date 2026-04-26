const amqp = require('amqplib');

const connectRabbitMQ = async (queueName, onMessage) => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    
    console.log(`✅ Connected to RabbitMQ. Waiting for messages in queue: ${queueName}`);
    
    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        await onMessage(data);
        channel.ack(msg);
      }
    });

    return channel;
  } catch (err) {
    console.error('❌ RabbitMQ connection failed, retrying in 5s...', err.message);
    return new Promise((resolve) => {
      setTimeout(() => resolve(connectRabbitMQ(queueName, onMessage)), 5000);
    });
  }
};

module.exports = { connectRabbitMQ };
