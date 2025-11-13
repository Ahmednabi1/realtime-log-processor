const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  page: {
    type: String,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
  processedAt: {
    type: Date,
    default: Date.now,
  },
});

logSchema.index({ timestamp: -1 }); 

logSchema.index({ userId: 1 });

logSchema.index({ action: 1 });

logSchema.index({ userId: 1, action: 1, timestamp: -1 });

const Log = mongoose.model('Log', logSchema);

module.exports = Log;