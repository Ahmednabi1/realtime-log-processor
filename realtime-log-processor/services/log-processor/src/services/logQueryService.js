const Log = require('../domain/logModel');

/**
 * @param {object} queryParams - query parameters from the controller.
 */
const queryLogs = async (queryParams) => {
  const {
    userId,
    action,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = queryParams;

  const filter = {};
  if (userId) filter.userId = userId;
  if (action) filter.action = action;

  if (startDate || endDate) {
    filter.timestamp = {};
    if (startDate) filter.timestamp.$gte = new Date(startDate);
    if (endDate) filter.timestamp.$lte = new Date(endDate);
  }

  const options = {
    sort: { timestamp: -1 }, 
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const skip = (options.page - 1) * options.limit;

  try {
    const [logs, totalDocs] = await Promise.all([
      Log.find(filter)
        .sort(options.sort)
        .skip(skip)
        .limit(options.limit)
        .lean(), 
      
      Log.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDocs / options.limit);

    return {
      data: logs,
      pagination: {
        totalDocs,
        limit: options.limit,
        totalPages,
        page: options.page,
        hasNextPage: options.page < totalPages,
        hasPrevPage: options.page > 1,
      },
    };
  } catch (error) {
    console.error('Error querying logs:', error);
    throw new Error('Database query failed.');
  }
};

module.exports = {
  queryLogs,
};