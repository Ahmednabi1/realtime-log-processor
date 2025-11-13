const express = require('express');
require('dotenv').config();
const { connectDB } = require('./config/mongo');
const { connectConsumer, disconnectConsumer } = require('./config/kafka');

const logRoutes = require('./routes/logRoutes');

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use('/api', logRoutes);


const startServer = async () => {
  try {
    await connectDB();

    await connectConsumer();

    app.listen(port, () => {
      console.log(`Log Processor service running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

const gracefulShutdown = async () => {
  console.log('Shutting down server gracefully...');
  await disconnectConsumer();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);