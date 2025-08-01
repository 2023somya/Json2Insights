const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  content: String,         // User's question
  response: String,        // AI's answer
  contextUsed: Boolean,    // Whether financial context was used
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Chat', chatSchema);