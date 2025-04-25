import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { pool } from '../utils/db.js'; // Assuming you have a DB utility for querying

dotenv.config();

// Initialize S3 Client
const S3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Middleware for multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|mp3|m4a|webm|pdf|txt/;
    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('Invalid file type'), false);
    }
  },
}).single('file'); // Accept one file at a time

// Generate pre-signed URL for file upload
const generateUploadURL = async (req, res) => {
  const { fileName, fileType } = req.query;
  const sanitizedFileName = `${uuidv4()}_${fileName.replace(/\s+/g, '_')}`;
  const expirationTime = Math.floor((Date.now() + 600 * 1000) / 1000); // Expires in 10 minutes

  const params = {
    Bucket: process.env.MEDIA_S3_BUCKET_NAME,
    Key: `uploads/${sanitizedFileName}`,
    ContentType: fileType,
    ACL: 'public-read',
  };

  try {
    const uploadURL = await getSignedUrl(S3, new PutObjectCommand(params), { expiresIn: 600 });
    res.json({ uploadURL, expirationTime });
  } catch (err) {
    console.error('Error generating pre-signed URL:', err);
    res.status(500).send('Error generating pre-signed URL');
  }
};

// Upload file to S3 via pre-signed URL
const uploadToS3 = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send('Error uploading file: ' + err.message);
    }

    const { file } = req;
    const metadata = JSON.parse(req.body.metadata); // Parse metadata from the request body
    const sanitizedFileName = `${uuidv4()}_${file.originalname.replace(/\s+/g, '_')}`;

    const params = {
      Bucket: process.env.MEDIA_S3_BUCKET_NAME,
      Key: `upload/${sanitizedFileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      // Upload file to S3
      const command = new PutObjectCommand(params);
      await S3.send(command);

      // Construct the URL for the uploaded file
      const fileUrl = `https://${process.env.MEDIA_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/upload/${sanitizedFileName}`;

      // Save metadata to the database
      const fileMetadata = {
        fileName: sanitizedFileName,
        fileUrl,
        fileType: file.mimetype,
        size: file.size,
        description: metadata.description || null,
        title: metadata.title || null,
        tags: metadata.tags || null,
        thumbnail: metadata.thumbnail || null,
        category: metadata.category || null,
        duration: metadata.duration || null,
        resolution: metadata.resolution || null,
        format: metadata.format || null,
        monetization: metadata.monetization === 'true' || null,
        rightsClaims: metadata.rightsClaims || null,
        comments: metadata.comments || null,
        videoTranscript: metadata.videoTranscript || null,
        geoCoordinates: metadata.geoCoordinates || null,
      };

      await storeMetadataInDB(fileMetadata); // Store metadata in DB
      res.json({ message: 'File uploaded successfully', url: fileUrl });
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      res.status(500).send('Error uploading to S3');
    }
  });
};

// Store metadata in DB
const storeMetadataInDB = async (fileMetadata) => {
  const query = `
    INSERT INTO media_files (
      file_name, file_url, file_type, size, description, title, tags, thumbnail, category, 
      duration, resolution, format, monetization, rights_claims, comments, video_transcript, geo_coordinates
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )`;

  const values = [
    fileMetadata.fileName,
    fileMetadata.fileUrl,
    fileMetadata.fileType,
    fileMetadata.size,
    fileMetadata.description,
    fileMetadata.title,
    fileMetadata.tags,
    fileMetadata.thumbnail,
    fileMetadata.category,
    fileMetadata.duration,
    fileMetadata.resolution,
    fileMetadata.format,
    fileMetadata.monetization,
    fileMetadata.rightsClaims,
    fileMetadata.comments,
    fileMetadata.videoTranscript,
    fileMetadata.geoCoordinates,
  ];

  await pool.query(query, values);  // Execute query with dynamic values
};

export { generateUploadURL, uploadToS3, storeMetadataInDB };
