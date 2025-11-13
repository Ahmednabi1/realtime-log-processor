const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'log-producer',
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();
const topic = process.env.KAFKA_TOPIC;


const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('Kafka producer connected successfully');
  } catch (error) {
    console.error('Failed to connect Kafka producer:', error);
    process.exit(1); 
  }
};

const disconnectProducer = async () => {
  try {
    await producer.disconnect();
    console.log('Kafka producer disconnected successfully');
  } catch (error) {
    console.error('Failed to disconnect Kafka producer:', error);
  }
};

/**
 * @param {object} logData - log data to send.
 */
const sendLog = async (logData) => {
  try {
    const message = JSON.stringify(logData);

    await producer.send({
      topic: topic,
      messages: [
        { value: message },
      ],
    });
  } catch (error) {
    console.error('Error sending log to Kafka:', error);
  }
};

module.exports = {
  connectProducer,
  disconnectProducer,
  sendLog,
};