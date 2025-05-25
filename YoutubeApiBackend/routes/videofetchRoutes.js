// youtube_api\routes\videofetchRoutes.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videofetchController');
// const validateApiKey = require('../middleware/validateApiKey');

// Apply API key validation middleware to all routes
// router.use(validateApiKey);


//router.get('/', videoController.getAllVideos);

// Fetch all videos in a category
router.get("/all", videoController.getAllVideos);

router.get("/video/:id", videoController.getVideoById);

// Search videos in both YouTube API and database
router.get("/search", videoController.searchVideos);

// Get video details by ID
router.get("/:videoId", videoController.get1UtubeVideoAndDetails);

// Fetch details of a specific video from S3/MySQL
router.get("/s3/:id", videoController.get1S3VideoAndDetails);

// Fetch route for chaannels details
router.get("/channels/:id", videoController.getChannelDetails);


module.exports = router;