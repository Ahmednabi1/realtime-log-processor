const express = require('express');
require('dotenv').config();
const { connectProducer, disconnectProducer } = require('./config/kafka');
const logRoutes = require('./routes/logRoutes');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json()); 

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use('/api', logRoutes);

const startServer = async () => {
  try {
    await connectProducer();

    app.listen(port, () => {
      console.log(`Log Producer service running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

const gracefulShutdown = async () => {
  console.log('Shutting down server gracefully...');
  await disconnectProducer();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);