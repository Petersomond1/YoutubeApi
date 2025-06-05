// YoutubeApiBackend\server.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const rateLimit = require('express-rate-limit');

const videofetchRoutes = require("./routes/videofetchRoutes");
const mediauploadRoutes = require("./routes/mediauploadRoutes");
const { pool } = require('./config/db');
const { testS3Connection } = require('./config/S3');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── CORS CONFIGURATION (SIMPLIFIED TO MATCH WORKING VERSION) ──────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://youtube.petersomond.com",
  "https://www.youtube.petersomond.com",
  "http://youtubeapi-frontend-statics3.s3-website-us-east-1.amazonaws.com",
  "https://d32z53idds3ccw.cloudfront.net"
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'X-Requested-With']
};

// ─── HELPER FUNCTION FOR CORS HEADERS ──────────────────────────────────────────────
const setCORSHeaders = (res, req) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
};

// ─── APPLY CORS MIDDLEWARE GLOBALLY ──────────────────────────────────────────────────────
app.use(cors(corsOptions));

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ─── SECURITY HEADERS (after CORS) ──────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ─── LOGGING (development only) ───────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── RATE LIMITER ────────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ─── HEALTH CHECK ROUTE ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  setCORSHeaders(res, req);
  res.json({
    status: 'OK',
    message: 'Server is running with database and YouTube API',
    timestamp: new Date().toISOString()
  });
});

// ─── ROUTES WITH NEW ENDPOINT STRUCTURE ───────────────────────────────────────────────────────────
app.use("/api/videos", videofetchRoutes);
app.use("/api/media", mediauploadRoutes);

// ─── TEST DB & S3 CONNECTION ───────────────────────────────────────────────────────────────
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connection established.");
    connection.release();
  } catch (err) {
    console.error("❌ Failed to connect to the database:", err.message);
  }

  await testS3Connection();
})();

// ─── ERROR HANDLING MIDDLEWARE ─────────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  setCORSHeaders(res, req);
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  setCORSHeaders(res, req);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;