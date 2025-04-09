// controllers/youtubeController.js
const axios = require('axios');
const { YOUTUBE_API_KEY, YOUTUBE_API_URL } = require('../config/youtubeConfig');

// Fetch video details by ID
exports.getVideoDetails = async (req, res) => {
  const { videoId } = req.params;
  
  if (!videoId) {
    return res.status(400).json({ success: false, message: 'Video ID is required' });
  }

  try {
    const response = await axios.get(`${YOUTUBE_API_URL}/videos`, {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: YOUTUBE_API_KEY
      }
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    res.status(200).json({ success: true, data: response.data.items[0] });
  } catch (error) {
    console.error('YouTube API Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch video details' });
  }
};

// Search for videos by query
exports.searchVideos = async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ success: false, message: 'Search query is required' });
  }

  try {
    const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults: 10,
        q: query,
        key: YOUTUBE_API_KEY
      }
    });

    res.status(200).json({ success: true, data: response.data.items });
  } catch (error) {
    console.error('YouTube API Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to search videos' });
  }
};
