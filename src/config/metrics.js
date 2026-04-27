const promClient = require('prom-client');

const register = new promClient.Registry();

register.setDefaultLabels({
  app: 'notification-service'
});

promClient.collectDefaultMetrics({ register });

// Custom metric for processed notifications
const notificationsProcessedCounter = new promClient.Counter({
  name: 'notifications_processed_total',
  help: 'Total number of processed notifications',
  labelNames: ['status']
});

module.exports = {
  register,
  notificationsProcessedCounter
};
