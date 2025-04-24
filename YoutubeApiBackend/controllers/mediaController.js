// import axios from 'axios';
 import { pool } from '../utils/db.js'; // Assuming you have a DB utility for querying
 import dotenv from 'dotenv';
 import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { fromEnv } from "@aws-sdk/credential-provider-env";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
 import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
// import path from 'path';
// import fileUpload from 'express-fileupload';

dotenv.config();

const S3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 300000, // 5 minutes
    socketTimeout: 300000,    // 5 minutes
  }),
});

const generateUploadURL = async (req, res) => {
  const { fileName, fileType } = req.query;

  if (!fileName || !fileType) {
    return res.status(400).json({ error: 'Missing fileName or fileType in query parameters' });
  }

  const sanitizedFileName = `${uuidv4()}_${fileName.replace(/\s+/g, '_')}`;
 
   // Get current UTC time in milliseconds, then add expiration time (e.g., 10 minutes)
   const currentTime = Date.now();
   const expirationTime = Math.floor((currentTime + 600 * 1000) / 1000); // 600 seconds = 10 minutes

   
  const params = {
    Bucket: process.env.MEDIA_S3_BUCKET_NAME,
    Key: `upload/${sanitizedFileName}`,
    ContentType: fileType,
    ACL: 'public-read',
  };

  try {
    const command = new PutObjectCommand(params);
    const uploadURL = await getSignedUrl(S3, command, { expiresIn: 600 }); // 10 minutes expiration time
    res.json({ uploadURL, expirationTime });
  } catch (err) {
    console.error('Error generating pre-signed URL:', err);
    res.status(500).send('Error generating pre-signed URL');
  }
};



// // Set up Multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|mp3|m4a|webm|pdf|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('Invalid file type'), false);
    }
  }
}).single('file'); // Accept one file at a time


// // Handle file upload to S3 via pre-signed URL and store metadata
const uploadToS3 = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send('Error uploading file: ' + err.message);
    }

    console.log("file upload", req.file)
    const { file } = req;
    const sanitizedFileName = `${uuidv4()}_${file.originalname.replace(/\s+/g, '_')}`;



    const params = {
      Bucket: process.env.MEDIA_S3_BUCKET_NAME,
      Key: `upload/${sanitizedFileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      //ACL: 'public-read',
    };

    try {
      const data = await S3.upload(params).promise();

      const fileMetadata = {
        fileName: sanitizedFileName,
        fileUrl: data.Location,
        fileType: file.mimetype,
        size: file.size,
        description: req.body.description || null,
        title: req.body.title || null,
        tags: req.body.tags || null,
        thumbnail: req.body.thumbnail || null,
        category: req.body.category || null,
        duration: req.body.duration || null,
        resolution: req.body.resolution || null,
        format: req.body.format || null,
        monetization: req.body.monetization === 'true' || null,
        rightsClaims: req.body.rightsClaims || null,
        comments: req.body.comments || null,
        videoTranscript: req.body.videoTranscript || null,
        geoCoordinates: req.body.geoCoordinates || null,
      };

      await storeMetadataInDB(fileMetadata); // Store metadata in DB
      res.json({ message: 'File uploaded successfully', url: data.Location });
    } catch (error) {
      console.error(error);
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

 export { generateUploadURL, uploadToS3, storeMetadataInDB,
  //  fetchFromS3, fetchFromYoutube
   };



// ========================================

// dotenv.config();

// // Initialize S3 Client v3
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY },
//   //credentials: fromEnv(),
//   signatureVersion: 'v4',
// });

// // Fetch from YouTube API
// const fetchFromYoutube = async (req, res) => {
//   const { searchTerm } = req.params;
//   const url = `https://youtube-v31.p.rapidapi.com/search?part=snippet&q=${searchTerm}`;
//   const options = {
//     method: 'GET',
//     headers: {
//       'X-RapidAPI-Key': process.env.YOUTUBE_API_KEY,
//       'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
//     },
//   };

//   try {
//     const response = await axios.get(url, options);
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).send('Error fetching YouTube data');
//   }
// };

// // Generate Pre-signed URL for file upload
// const generateUploadURL = async (req, res) => {
//   const { fileName, fileType } = req.query;
//   console.log("file name", fileName)
//   console.log("file type", fileType)

//   if (!fileName || !fileType) {
//     return res.status(400).json({ error: 'Missing fileName or fileType in query parameters' });
//   }

//   // Sanitize fileName by replacing spaces with underscores and adding a UUID for uniqueness
//   const sanitizedFileName = `${uuidv4()}_${fileName.replace(/\s+/g, '_')}`;

  
//   // Get current server time and set expiration time
//   const currentDate = new Date();
//   const expirationTime = Math.floor((currentDate.getTime() + 300 * 1000) / 1000); // 5 minutes expiration time in seconds



// const params = {
//   Bucket: process.env.MEDIA_S3_BUCKET_NAME,
//   Key: `upload/${sanitizedFileName}`,
//   ContentType: fileType,
//   ACL: 'public-read',
// };

// try {
 

//   const command = new PutObjectCommand(params);
//   const uploadURL = await getSignedUrl(s3, command, { expiresIn: 300 });

//   res.json({ uploadURL, expirationTime });
// } catch (err) {
//   console.error('Error generating pre-signed URL:', err);
//   res.status(500).send('Error generating pre-signed URL');
// }
// }





// // Fetch media from S3
// const fetchFromS3 = async (req, res) => {
//   const { searchTerm } = req.params;
//   const params = {
//     Bucket: process.env.MEDIA_S3_BUCKET_NAME,
//     Prefix: searchTerm,
//   };

//   try {
//     const data = await s3.listObjectsV2(params).promise();
//     res.json(data);
//   } catch (error) {
//     res.status(500).send('Error fetching media from S3');
//   }
// };

