# VK-Paints Notification Service

## Description
Asynchronous worker that consumes events from RabbitMQ and sends email notifications.

## Tech Stack
- Node.js
- RabbitMQ
- Nodemailer
- Express (for metrics/health only)

## Role in System
Purely event-driven consumer. It does not expose business APIs but provides a metrics server on port 3000.

## Environment Variables
- PORT: Metrics server port (3000)
- RABBITMQ_URL: Connection string
- SMTP_HOST: Email server host
