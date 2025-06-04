server.js
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

// ─── CORS CONFIGURATION (CENTRALIZED) ──────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://youtube.petersomond.com",
  "https://www.youtube.petersomond.com",
  "http://youtubeapi-frontend-statics3.s3-website-us-east-1.amazonaws.com",
  "https://d32z53idds3ccw.cloudfront.net"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "X-Requested-With",
    "Accept",
    "Origin"
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200
};

// ─── HEALTH CHECK ROUTE (place before middleware) ───────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cache-Control, X-Requested-With, Accept, Origin'
  });
  return res.sendStatus(200);
});

// ─── APPLY CORS MIDDLEWARE GLOBALLY ──────────────────────────────────────────────────────
app.use(cors(corsOptions));

// ─── SECURITY HEADERS VIA HELMET (after CORS) ──────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ─── RATE LIMITER FOR PRE‐FLIGHT (OPTIONS) REQUESTS ────────────────────────────────────────
const optionsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,               // limit each IP to 100 OPTIONS requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method !== 'OPTIONS'
});

// ─── ENHANCED GLOBAL OPTIONS HANDLER ──────────────────────────────────────────────
app.options('*', optionsLimiter, (req, res) => {
  const origin = req.headers.origin;

  // Set CORS headers explicitly
  if (allowedOrigins.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cache-Control,X-Requested-With,Accept,Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // Cache preflight response for 24 hours

  // Log preflight requests for debugging
  console.log(`OPTIONS request from origin: ${origin}`);

  return res.sendStatus(200);
});

// ─── LOGGING (development only) ───────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── BODY PARSERS (with increased limits for file uploads) ──────────────────────────────────
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(bodyParser.json({
  limit: '50mb'
}));

// ─── CORS HEADERS MIDDLEWARE (for all responses) ────────────────────────────────────────────
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
});

// ─── ROUTES ───────────────────────────────────────────────────────────────────────────────
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

// ─── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Set CORS headers for error responses
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ─── 404 HANDLER ───────────────────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  // Set CORS headers for 404 responses
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;