const mongoose = require('mongoose');

const messagesCollection = 'messages';
const messagesSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(messagesCollection, messagesSchema);