const { sendLog } = require('../config/kafka');

/**
 * @param {object} logData - log data from the request.
 */
const produceLog = async (logData) => {
  if (!logData.userId || !logData.action) {
    throw new Error('Invalid log data: userId and action are required.');
  }

  const enrichedLogData = {
    ...logData,
    timestamp: new Date().toISOString(), 
  };


  sendLog(enrichedLogData);

  return enrichedLogData;
};

module.exports = {
  produceLog,
};