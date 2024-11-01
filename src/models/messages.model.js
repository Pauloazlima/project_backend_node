const mongoose = require('mongoose');

const messagesCollection = 'messages';

const messagesSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  message: String
})

module.exports = mongoose.model(messagesCollection, messagesSchema);