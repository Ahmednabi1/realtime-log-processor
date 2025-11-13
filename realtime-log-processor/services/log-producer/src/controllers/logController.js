const logProducerService = require('../services/logProducerService');

const postLog = async (req, res) => {
  try {
    const logData = req.body;

    if (!logData || Object.keys(logData).length === 0) {
      return res.status(400).json({
        message: 'Bad Request: Log data payload is empty.',
      });
    }
    
    const processedLog = await logProducerService.produceLog(logData);

 
    return res.status(202).json({
      message: 'Log accepted and queued for processing.',
      log: processedLog,
    });

  } catch (error) {
    if (error.message.startsWith('Invalid log data')) {
      return res.status(400).json({
        message: `Bad Request: ${error.message}`,
      });
    }

    console.error('Error in postLog controller:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

module.exports = {
  postLog,
};