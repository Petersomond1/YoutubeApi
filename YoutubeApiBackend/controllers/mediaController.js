import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { pool } from '../utils/db.js'; // Assuming you have a DB utility for querying
import axios from 'axios';


dotenv.config();


const bucketName = process.env.S3_BUCKET_NAME;

// YouTube API Configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;  // Make sure this is set in your .env
const YOUTUBE_API_URL = 'https://youtube-v31.p.rapidapi.com';


// Initialize S3 Client
const S3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


// Function to adjust time and ensure it matches AWS UTC time
const getAdjustedTime = () => {
  const now = new Date();
  now.setHours(now.getHours() - 4); // Subtract 4 hours
  return now.toISOString().replace(/\..+/, ''); // Remove milliseconds
};


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

  if (!fileName || !fileType) {
    return res.status(400).json({ error: 'Missing fileName or fileType in query parameters' });
  }
  // const sanitizedFileName = `${cuid()}.${fileName.replace(/\s+/g, '_')}`;

  const sanitizedFileName = `${uuidv4()}.${fileName.replace(/\s+/g, '_')}`;
  
  // Adjusting time for the 4-hour difference between local and AWS server time
  const adjustedDate = getAdjustedTime(0); // Reduce time by 4 hours
  console.log(`Adjusted Time for AWS: ${adjustedDate}`);

  const expirationTime = Math.floor((Date.now() + 600 * 1000) / 1000); // Expires in 10 minutes

  const params = {
    Bucket: process.env.MEDIA_S3_BUCKET_NAME,
    Key: `uploads/${sanitizedFileName}`,
    ContentType: fileType,
    // ACL: 'public-read',
  };

  try {
    const uploadURL = await getSignedUrl(S3, new PutObjectCommand(params), { expiresIn: 600 });
    res.json({ uploadURL, expirationTime });
  } catch (err) {
    console.error('Error generating pre-signed URL:', err);
    res.status(500).send('Error generating pre-signed URL');
  }
};

// Handle file upload to S3
const uploadToS3 = async (req, res) => {
  console.log('Received file upload request:', req.body);
  console.log('Received file:', req.file); // Log the file object
  console.log('Received metadata:', req.body.metadata);

  if (!req.file) {
    console.error('No file received. Ensure the request has Content-Type: multipart/form-data and the field name matches "file".');
    return res.status(400).json({ error: 'No file uploaded. Ensure the request has Content-Type: multipart/form-data and the field name matches "file".' });
  }
  const  file = req.file;  // file from frontend
  const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {}; // Parse metadata from request body
  const sanitizedFileName = `${uuidv4()}.${file.originalname.replace(/\s+/g, '_')}`;


  const params = {
    Bucket: process.env.MEDIA_S3_BUCKET_NAME,
    Key: `uploads/${sanitizedFileName}`,
     Body: file.buffer, // Use the buffer from multer
    ContentType: file.mimetype,
    //ACL: 'public-read',
  };

  try {
    const command = new PutObjectCommand(params);
    await S3.send(command); // Upload the file to S3

       const fileUrl = `https://${process.env.MEDIA_S3_BUCKET_NAME}.S3.${process.env.AWS_REGION}.amazonaws.com/uploads/${sanitizedFileName}`;

    // Save metadata to the database
    const fileMetadata = {
      fileName: sanitizedFileName,
      fileUrl: fileUrl,
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
      console.error('Error uploading file to DB:', error);
      res.status(500).send('Error uploading to database');
    }
  };


// Store metadata in DB
const storeMetadataInDB = async (fileMetadata) => {
  const query = `
    INSERT INTO media_files (
      file_name, file_url, file_type, size, description, title, tags, thumbnail, category, 
      duration, resolution, format, monetization, rights_claims, comments, video_transcript, geo_coordinates
    ) VALUES (
     ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
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

  try {
    console.log('Executing query:', query);
    console.log('With values:', values);
    await pool.query(query, values);
    console.log('Metadata successfully stored in the database.');
  } catch (err) {
    console.error('Error storing metadata in DB:', err.message);
    throw new Error('Database error');
  }
};


// Function to fetch YouTube data key options
const options = {
  headers: {
    'X-RapidAPI-Key': YOUTUBE_API_KEY,
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
  },
};

// Function to fetch YouTube data
const fetchFromYoutube = async (searchTerm) => {
  try {
    const { data } = await axios.get(`${YOUTUBE_API_URL}/search`, {
      params: {
        q: searchTerm,
        maxResults: 50,
      },
      headers: options.headers,
    });
    return data;
  } catch (error) {
    console.error('Error fetching from YouTube API:', error);
    throw new Error('YouTube API request failed');
  }
};

// Endpoint to fetch both YouTube and S3 data
const fetchMediaData = async (req, res) => {
  const { searchTerm } = req.params;

  try {
    // Fetch YouTube data
    const youtubeData = await fetchFromYoutube(searchTerm);

    // Fetch S3 data from your database or directly from the bucket
    const s3Data = await fetchFromS3(searchTerm); // Assuming you have this function

    // Combine YouTube and S3 results
    const combinedData = {
      youtube: youtubeData.items,
      s3: s3Data.Contents,
    };

    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching media data:', error);
    res.status(500).json({ message: 'Error fetching media data' });
  }
};






export { generateUploadURL, uploadToS3, storeMetadataInDB, upload, S3, fetchMediaData }; // Export the functions for use in routes

