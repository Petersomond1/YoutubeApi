const express = require("express");
const mediauploadController = require("../controllers/mediauploadController");

const router = express.Router();

// 1) GET /api/media/generate-upload-url?fileName=…&fileType=…
// (Keep for backward compatibility, but the new upload method doesn't need this)
router.get(
  "/generate-upload-url",
  mediauploadController.generateUploadURL
);

// 2) POST /api/media/upload
// Now handles both main file and thumbnail with metadata
// multipart/form-data: { 
//   file: <main file binary>, 
//   thumbnail: <thumbnail file binary> (optional),
//   metadata: "<JSON string>" 
// }
router.post(
  "/upload",
  mediauploadController.uploadToS3 // Multer is now handled inside the controller
);

module.exports = router;