// YoutubeApiBackend\routes\mediauploadRoutes.js
const express = require("express");
const mediauploadController = require("../controllers/mediauploadController");

const router = express.Router();

// ─── CORS HELPER ──────────────────────────────────────────────────────
const setCORSHeaders = (res, req) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
};

// ─── PREFLIGHT OPTIONS HANDLER ──────────────────────────────────────────
router.options('*', (req, res) => {
  setCORSHeaders(res, req);
  res.sendStatus(200);
});

// ─── GENERATE PRE-SIGNED UPLOAD URL (Legacy compatibility) ──────────────
// GET: /api/media/generate-upload-url
router.get("/generate-upload-url", (req, res) => {
  setCORSHeaders(res, req);
  mediauploadController.generateUploadURL(req, res);
});

// ─── DIRECT FILE UPLOAD (Main endpoint) ─────────────────────────────────
// POST: /api/media/upload
router.post("/upload", (req, res) => {
  setCORSHeaders(res, req);
  mediauploadController.uploadToS3(req, res);
});

// ─── HEALTH CHECK ───────────────────────────────────────────────────────
router.get("/health", (req, res) => {
  setCORSHeaders(res, req);
  res.json({
    status: 'OK',
    service: 'Media Upload Service',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;