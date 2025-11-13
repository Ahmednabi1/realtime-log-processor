const Log = require('../domain/logModel');

/**
 * @param {object} logData - parsed Kafka log.
 */
const processLog = async (logData) => {
  try {

    const log = new Log(logData);
    await log.save();

  } catch (error) {
    console.error('Error processing log:', error.message);

  }
};

module.exports = {
  processLog,
};