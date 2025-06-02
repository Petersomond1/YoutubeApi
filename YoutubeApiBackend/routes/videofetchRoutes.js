const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videofetchController');
// const validateApiKey = require('../middleware/validateApiKey');

// CORS middleware for all video routes
router.use((req, res, next) => {
  // Set CORS headers for all requests
  res.header('Access-Control-Allow-Origin', 'https://www.youtube.petersomond.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Apply API key validation middleware to all routes (if needed)
// router.use(validateApiKey);

// Fetch all videos in a category
router.get("/all", videoController.getAllVideos);

// Search videos in both YouTube API and database
router.get("/search", videoController.searchVideos);

// Fetch video details by ID (this should come before the generic /:videoId route)
router.get("/video/:id", videoController.getVideoById);

// Fetch details of a specific video from S3/MySQL
router.get("/s3/:id", videoController.get1S3VideoAndDetails);

// Fetch route for channel details
router.get("/channels/:id", videoController.getChannelDetails);

// Get video details by ID (keep this last due to route matching)
router.get("/:videoId", videoController.get1UtubeVideoAndDetails);

module.exports = router;