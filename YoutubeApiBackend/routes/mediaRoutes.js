
import express from 'express';
import fileUpload from 'express-fileupload';
import {uploadToS3, generateUploadURL, 
 // fetchFromS3, fetchFromYoutube 
} from '../controllers/mediaController.js';

 const router = express.Router();

//   We use these to handle the file upload and metadata storage.
//   /api/media/generate-upload-url: Generates a pre-signed URL for file upload.
//   /api/media/upload: Stores metadata in MySQL.

// // Endpoint to get media from YouTube
// router.get('/youtube/:searchTerm', fetchFromYoutube);

// // Endpoint to get media from S3
// router.get('/s3/:searchTerm', fetchFromS3);



// // Route to handle generating pre-signed URL
router.get('/generate-upload-url', (_, __, next) => {
  console.log('Hit /generate-upload-url route');
  next();
}, generateUploadURL);

// // Middleware to handle file uploads
router.use(fileUpload());

// // Route to handle media upload to S3
router.post('/upload', uploadToS3);


export default router;  