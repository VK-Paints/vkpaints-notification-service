const promClient = require('prom-client');

const register = new promClient.Registry();

register.setDefaultLabels({
  app: 'notification-service'
});

promClient.collectDefaultMetrics({ register });

// RabbitMQ Metrics
const mqMessageCounter = new promClient.Counter({
  name: 'mq_messages_total',
  help: 'Total number of messages processed via RabbitMQ',
  labelNames: ['action', 'status']
});
register.registerMetric(mqMessageCounter);

module.exports = {
  register,
  mqMessageCounter
};
