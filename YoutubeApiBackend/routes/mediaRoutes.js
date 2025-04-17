const express = require('express');
const { fetchFromS3, fetchFromYoutube } = require('../controllers/mediaController');
const router = express.Router();

// Endpoint to get media from YouTube
router.get('/youtube/:searchTerm', fetchFromYoutube);

// Endpoint to get media from S3
router.get('/s3/:searchTerm', fetchFromS3);

module.exports = router;
