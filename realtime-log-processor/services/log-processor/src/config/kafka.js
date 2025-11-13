const { Kafka } = require('kafkajs');
const { processLog } = require('../services/logProcessorService');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'log-processor',
  brokers: [process.env.KAFKA_BROKER],
});

const topic = process.env.KAFKA_TOPIC;
const groupId = process.env.KAFKA_GROUP_ID;
const consumer = kafka.consumer({ groupId: groupId });

const connectConsumer = async () => {
  try {
    await consumer.connect();
    console.log('Kafka consumer connected');

    await consumer.subscribe({ topic: topic, fromBeginning: true });
    console.log(`Subscribed to topic: ${topic}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const rawLog = message.value.toString();
          
          const logData = JSON.parse(rawLog);

          console.log(`Received log: [User: ${logData.userId}, Action: ${logData.action}]`);

          await processLog(logData);

        } catch (error) {
          console.error('Error parsing or processing message:', error);
        }
      },
    });

  } catch (error) {
    console.error('Failed to connect or run Kafka consumer:', error);
    process.exit(1);
  }
};

const disconnectConsumer = async () => {
  try {
    await consumer.disconnect();
    console.log('Kafka consumer disconnected');
  } catch (error) {
    console.error('Failed to disconnect Kafka consumer:', error);
  }
};

module.exports = {
  connectConsumer,
  disconnectConsumer,
};