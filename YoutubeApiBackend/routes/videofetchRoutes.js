// YoutubeApiBackend\routes\videofetchRoutes.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videofetchController');

// ─── NEW ENDPOINT STRUCTURE (MATCHES WORKING API) ───────────────────────────────
// Main endpoint for fetching all videos with category filtering
router.get("/all", videoController.getAllVideos);

// Search videos across both YouTube and Database
router.get("/search", videoController.searchVideos);

// Get specific video details by ID with source parameter
router.get("/video/:id", videoController.getVideoById);

// Get database/S3 video details (legacy compatibility)
router.get("/s3/:id", videoController.get1S3VideoAndDetails);

// Get YouTube channel details
router.get("/channels/:id", videoController.getChannelDetails);

// Get YouTube video details (legacy compatibility)
router.get("/:videoId", videoController.get1UtubeVideoAndDetails);

module.exports = router;