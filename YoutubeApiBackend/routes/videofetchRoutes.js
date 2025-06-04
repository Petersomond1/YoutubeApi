const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videofetchController');


// Fetch all videos in a category
router.get("/all", videoController.getAllVideos);

// Search videos
router.get("/search", videoController.searchVideos);

// Get video by ID (YouTube or DB)
router.get("/video/:id", videoController.getVideoById);

// Get a single S3/DB video
router.get("/s3/:id", videoController.get1S3VideoAndDetails);

// Get channel details
router.get("/channels/:id", videoController.getChannelDetails);

// Get YouTube video by ID (fallback)
router.get("/:videoId", videoController.get1UtubeVideoAndDetails);

module.exports = router;
