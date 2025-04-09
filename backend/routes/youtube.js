// routes/youtube.js
const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');

// Routes for YouTube API
router.get('/video/:videoId', youtubeController.getVideoDetails);
router.get('/search', youtubeController.searchVideos);

module.exports = router;
