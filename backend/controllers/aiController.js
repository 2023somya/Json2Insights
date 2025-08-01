const axios = require('axios');
const Chat = require('../models/ChatHistory');

const ASK_URL = 'http://localhost:8000/ask-ai';

exports.analyzeRevenue = async (req, res) => {
  try {
    const { prompt } = req.body;

     // Validate input
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }
    
    // Call Python FastAPI service
    const response = await axios.post(ASK_URL, {
      prompt: prompt
    });

     // Save simple chat message
    const savedChat = await Chat.create({
      content: prompt,
      response: response.data.answer,
      contextUsed: response.data.context_used,
      //chatId: response._id,
      timestamp: new Date()
    });

     res.json({
      success: true,
      analysis: savedChat.response,
      contextUsed: savedChat.contextUsed,
      chatId: savedChat._id,
      timestamp: savedChat.timestamp
    });
    
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.detail || 'AI analysis failed'
    });
  }
};

exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ timestamp: -1 });
    
    res.json({
      success: true,
      count: chats.length,
      chats: chats.map(chat => ({
        id: chat._id,
        question: chat.content,
        answer: chat.response,
        usedContext: chat.contextUsed,
        timestamp: chat.timestamp
      }))
    });

  } catch (error) {
    console.error('Failed to fetch chats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat history',
      error: error.message
    });
  }
};