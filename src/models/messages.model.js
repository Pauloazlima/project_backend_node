const mongoose = require('mongoose');

const messagesCollection = 'messages';

const messagesSchema = new mongoose.Schema({
  
})

module.exports = mongoose.model(messagesCollection, messagesSchema);