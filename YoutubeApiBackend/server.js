// youtubefrontApi\youtube_api\server.js
require('dotenv').config();
const express    = require("express");
const cors       = require("cors");
const morgan     = require("morgan");
const bodyParser = require("body-parser");

const videofetchRoutes   = require("./routes/videofetchRoutes");
const mediauploadRoutes  = require("./routes/mediauploadRoutes");
const { pool }           = require('./config/db');
const { testS3Connection } = require('./config/S3');


const app  = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ─────────────────────────
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ─── ROUTES ────────────────────────────
app.use("/api/videos", videofetchRoutes);
app.use("/api/media",  mediauploadRoutes);


// ─── TEST DB CONNECTION ────────────────────────────
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

// ─── ERROR HANDLER ───────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Something broke!" });
});

// ─── START ───────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;

