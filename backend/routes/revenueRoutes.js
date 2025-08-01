const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Store files in a temporary global variable
global.uploadedFilesCache = [];

// 1. Just uploads files to memory/session
router.post('/upload/files', upload.array('files'), (req, res) => {
  try {
//check if files selected
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    global.uploadedFilesCache = req.files; // global cavhe, not session
    res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});
const { getQuarterlySummary } = require('../controllers/revenueController');
const { getFilteredByQ4Revenue } = require('../controllers/revenueController');

router.get('/quarterly/summary', getQuarterlySummary);
router.get('/quarterly/filter', getFilteredByQ4Revenue);

router.post('/reset/upload', (req, res) => {
  global.uploadedFilesCache = [];
  res.json({ message: 'Upload cache cleared' });
});

module.exports = router;