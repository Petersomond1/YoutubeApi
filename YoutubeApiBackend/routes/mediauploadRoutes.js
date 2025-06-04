const express = require("express");
const mediauploadController = require("../controllers/mediauploadController");

const router = express.Router();

// GET: /api/media/generate-upload-url  
router.get("/generate-upload-url", mediauploadController.generateUploadURL);

// POST: /api/media/upload  
router.post("/upload", mediauploadController.uploadToS3);

module.exports = router;
