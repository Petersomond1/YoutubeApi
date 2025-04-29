import express from 'express';
import dotenv from 'dotenv';
import mediaRoutes from './routes/mediaRoutes.js';
import cors from 'cors';
import morgan from 'morgan';
import { S3Client } from "@aws-sdk/client-s3";
import { pool } from './utils/db.js'; // Import the database pool

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
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Update with your front-end URL
  methods: ['PUT', 'GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

const port = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// // Test the database connection
// (async () => {
//   try {
//     const connection = await pool.getConnection();
//     const [results] = await connection.query('SELECT 1 + 1 AS result');
//     console.log("Database connection established successfully. Query result:", results[0].result);
//     connection.release(); // Release the connection back to the pool
//   } catch (err) {
//     console.error("Failed to connect to the database:", err.message);
//     process.exit(1); // Exit the process if the database connection fails
//   }
// })();

app.use('/api/media', mediaRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send(`Backend server is running on port ${port}`);
});

export { S3 };
export default app;