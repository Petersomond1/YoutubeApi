import express from 'express';
import dotenv from 'dotenv';
import mediaRoutes from './routes/mediaRoutes.js';
import cors from 'cors';
import morgan from 'morgan';
import { S3Client } from "@aws-sdk/client-s3";

dotenv.config();

const S3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/media', mediaRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send(`Backend server is running on port ${port}`);
});



// import express from 'express';
// import dotenv from 'dotenv';
// import mediaRoutes from './routes/mediaRoutes.js';
// import cors from 'cors';
// //import { log } from 'console';
// import morgan from 'morgan';
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// dotenv.config();

// // aws.config.update({
// //   region: process.env.AWS_REGION,
// //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// // });

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     singnatureVersion: 'v4',
//   },
// });

// const app = express();


// // CORS setup
// app.use(cors({
//   origin: 'http://localhost:5173', // Allow requests from your frontend port (Vite development server)
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
//   credentials: true, // Allow cookies to be sent with requests
// }));

// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
// app.use(express.static('uploads'));
// app.use(express.static('media'));
// app.use(express.static('assets'));
// app.use(express.static('assets/images'));
// app.use(express.static('assets/videos'));
// app.use(express.static('assets/audio'));
// app.use(morgan('dev'));



// app.use('/api/media', mediaRoutes);



// // app.listen(port, '::', () => {
// // //app.listen(port, '0.0.0.0', () => {
// app.listen(port, '::', (err) => {
//   if (err) {
//     console.error('Failed to start server:', err);
//   } else {
//     console.log(`Server is running on port ${port}`);
//   }
// });


// app.get('/', (req, res) => {
//   res.send(`Backend server is running ${port}`);
// } );

