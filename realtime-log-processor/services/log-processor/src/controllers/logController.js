const { queryLogs } = require('../services/logQueryService');

const getLogs = async (req, res) => {
  try {
    const queryParams = req.query;
    
    const result = await queryLogs(queryParams);

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error in getLogs controller:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

module.exports = {
  getLogs,
};