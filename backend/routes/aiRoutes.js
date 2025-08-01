const express = require('express');
const router = express.Router();
const { analyzeRevenue, getChatHistory,
  getUserChats, 
  getAllChats} = require('../controllers/aiController');

router.post('/askAI', analyzeRevenue);

// Chat history routes
router.get('/chats', getAllChats);
//router.get('/user/:userId/chats', getUserChats);
module.exports = router;
