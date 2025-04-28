
import express from 'express';
import multer from 'multer';
// import fileUpload from 'express-fileupload';
import {uploadToS3, generateUploadURL, 
 // fetchFromS3, fetchFromYoutube 
} from '../controllers/mediaController.js';

 const router = express.Router();

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file'); // Expect a single file with the field name "file"



//   We use these to handle the file upload and metadata storage.
//   /api/media/generate-upload-url: Generates a pre-signed URL for file upload.
//   /api/media/upload: Stores metadata in MySQL.

// // Endpoint to get media from YouTube
// router.get('/youtube/:searchTerm', fetchFromYoutube);

// // Endpoint to get media from S3
// router.get('/s3/:searchTerm', fetchFromS3);

// // Middleware to handle file uploads
// router.use(fileUpload());

// // Route to handle generating pre-signed URL
router.get('/generate-upload-url', (_, __, next) => {
  console.log('Hit /generate-upload-url route');
  next();
}, generateUploadURL);


// // Route to handle media upload to S3
router.post('/uploads', upload, uploadToS3);


// // Route to handle storing metadata in the database
router.post('/store-metadata', async (req, res) => {
  try {
    const metadata = req.body;
    await storeMetadataInDB(metadata);
    res.status(200).json({ message: 'Metadata stored successfully' });
  } catch (error) {
    console.error('Error storing metadata:', error);
    res.status(500).json({ message: 'Error storing metadata' });
  }
});

export default router;  