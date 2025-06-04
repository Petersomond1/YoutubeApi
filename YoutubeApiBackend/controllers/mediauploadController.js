const multer = require('multer');
const { pool } = require('../config/db.js'); 
const { S3 } = require('../config/S3');
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");

require('dotenv').config();

const bucketName = process.env.MEDIA_S3_BUCKET_NAME;

// Function to sanitize filename
const sanitizeFileName = (fileName) => {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
};

// Function to generate unique filename
const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.split('.').slice(0, -1).join('.');
  return `${timestamp}-${random}.${sanitizeFileName(nameWithoutExt)}.${extension}`;
};

// Store metadata in database
const storeMetadataInDB = async (fileMetadata) => {
  const query = `
    INSERT INTO media_files (
      file_name, file_url, file_type, size, description, title, tags, 
      thumbnail_url, category, duration, resolution, format, monetization, 
      rights_claims, comments, video_transcript, geo_coordinates, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  const values = [
    fileMetadata.fileName,
    fileMetadata.fileUrl,
    fileMetadata.fileType,
    fileMetadata.size,
    fileMetadata.description,
    fileMetadata.title,
    fileMetadata.tags,
    fileMetadata.thumbnailUrl,
    fileMetadata.category,
    fileMetadata.duration,
    fileMetadata.resolution,
    fileMetadata.format,
    fileMetadata.monetization,
    fileMetadata.rightsClaims,
    fileMetadata.comments,
    fileMetadata.videoTranscript,
    fileMetadata.geoCoordinates
  ];

  try {
    const [result] = await pool.execute(query, values);
    console.log('Metadata stored successfully with ID:', result.insertId);
    return result.insertId;
  } catch (error) {
    console.error('Error storing metadata in database:', error);
    throw error;
  }
};

// Configure multer for handling multiple files
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mp3|m4a|webm|pdf|txt|mov|avi|mkv/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.includes('video') || file.mimetype.includes('audio');
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error(`Invalid file type: ${file.originalname}. Allowed types: video, audio, image, PDF, TXT`), false);
    }
  },
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  }
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

// Generate pre-signed URL for file upload (keeping for compatibility)
const generateUploadURL = async (req, res) => {
  const { fileName, fileType } = req.query;

  if (!fileName || !fileType) {
    return res.status(400).json({ 
      error: 'Missing fileName or fileType in query parameters' 
    });
  }

  const sanitizedFileName = generateUniqueFileName(fileName);

  const params = {
    Bucket: bucketName,
    Key: `uploads/${sanitizedFileName}`,
    ContentType: fileType,
  };

  try {
    const uploadURL = await getSignedUrl(S3, new PutObjectCommand(params), { 
      expiresIn: 600 // 10 minutes
    });
    
    res.json({ 
      uploadURL, 
      fileName: sanitizedFileName,
      expirationTime: Math.floor((Date.now() + 600 * 1000) / 1000)
    });
  } catch (err) {
    console.error('Error generating pre-signed URL:', err);
    res.status(500).json({ 
      error: 'Error generating pre-signed URL',
      message: err.message 
    });
  }
};

// Handle file upload to S3 with thumbnail support
const uploadToS3 = async (req, res) => {
  // Use multer middleware
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ 
        error: 'File upload error', 
        message: err.message 
      });
    }

    try {
      console.log('Received upload request');
      console.log('Files:', req.files);
      console.log('Body:', req.body);

      // Check if main file exists
      if (!req.files || !req.files.file || !req.files.file[0]) {
        return res.status(400).json({ 
          error: 'No main file uploaded. Ensure the field name is "file".' 
        });
      }

      const mainFile = req.files.file[0];
      const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;
      
      // Parse metadata
      let metadata = {};
      try {
        metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {};
      } catch (parseError) {
        console.error('Error parsing metadata:', parseError);
        return res.status(400).json({ 
          error: 'Invalid metadata format' 
        });
      }

      // Generate unique filenames
      const mainFileName = generateUniqueFileName(mainFile.originalname);
      let thumbnailFileName = null;
      let thumbnailUrl = metadata.thumbnailUrl || null;

      // Upload main file to S3
      const mainParams = {
        Bucket: bucketName,
        Key: `uploads/${mainFileName}`,
        Body: mainFile.buffer,
        ContentType: mainFile.mimetype,
      };

      console.log('Uploading main file to S3...');
      const mainCommand = new PutObjectCommand(mainParams);
      await S3.send(mainCommand);

      const mainFileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${mainFileName}`;
      console.log('Main file uploaded successfully:', mainFileUrl);

      // Upload thumbnail if provided
      if (thumbnailFile) {
        thumbnailFileName = generateUniqueFileName(`thumb_${thumbnailFile.originalname}`);
        
        const thumbnailParams = {
          Bucket: bucketName,
          Key: `uploads/thumbnails/${thumbnailFileName}`,
          Body: thumbnailFile.buffer,
          ContentType: thumbnailFile.mimetype,
        };

        console.log('Uploading thumbnail to S3...');
        const thumbnailCommand = new PutObjectCommand(thumbnailParams);
        await S3.send(thumbnailCommand);

        thumbnailUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/thumbnails/${thumbnailFileName}`;
        console.log('Thumbnail uploaded successfully:', thumbnailUrl);
      }

      // Prepare file metadata for database
      const fileMetadata = {
        fileName: mainFileName,
        fileUrl: mainFileUrl,
        fileType: mainFile.mimetype,
        size: mainFile.size,
        description: metadata.description || null,
        title: metadata.title || mainFile.originalname.split('.')[0],
        tags: metadata.tags || null,
        thumbnailUrl: thumbnailUrl,
        category: metadata.category || 'New',
        duration: metadata.duration || null,
        resolution: metadata.resolution || null,
        format: metadata.format || mainFile.originalname.split('.').pop().toLowerCase(),
        monetization: metadata.monetization !== undefined ? Number(metadata.monetization) : 0,
        rightsClaims: metadata.rightsClaims || null,
        comments: metadata.comments || null,
        videoTranscript: metadata.videoTranscript || null,
        geoCoordinates: metadata.geoCoordinates || null,
      };

      // Store metadata in database
      console.log('Storing metadata in database...');
      const insertId = await storeMetadataInDB(fileMetadata);

      // Return success response
      res.status(200).json({ 
        success: true,
        message: 'File uploaded successfully and metadata saved',
        data: {
          id: insertId,
          fileUrl: mainFileUrl,
          thumbnailUrl: thumbnailUrl,
          fileName: mainFileName,
          thumbnailFileName: thumbnailFileName,
          metadata: fileMetadata
        }
      });

    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ 
        error: 'Error uploading file to S3 or saving to database',
        message: error.message 
      });
    }
  });
};





module.exports = { generateUploadURL, uploadToS3, storeMetadataInDB, upload, S3 }; 



     
