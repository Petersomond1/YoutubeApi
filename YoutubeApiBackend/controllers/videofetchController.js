// YoutubeApiBackend\controllers\videofetchController.js
const axios = require("axios");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 });
const { pool } = require("../config/db");

// Use environment variable for API key
const RAPID_API_KEY = process.env.RAPID_API_KEY || "eaf54a6583msh168339a792b7460p16e58fjsn309b077e0b30";
const RAPID_API_HOST = "youtube-v31.p.rapidapi.com";

// S3 Default Thumbnail URL
const DEFAULT_THUMBNAIL_URL = "https://youtubeapi-frontend-statics3.s3.us-east-1.amazonaws.com/assets/default-thumbnail.png";

const options = {
  headers: {
    "X-RapidAPI-Key": RAPID_API_KEY,
    "X-RapidAPI-Host": RAPID_API_HOST,
  }
};

// ─── HELPER FUNCTION FOR CORS HEADERS ──────────────────────────────────────────────
const setCORSHeaders = (res, req) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
};

const videoController = {

  // ─── MAIN ENDPOINT: GET ALL VIDEOS BY CATEGORY ───────────────────────────────
  getAllVideos: async (req, res) => {
    setCORSHeaders(res, req);
    try {
      const { category = "New", pageToken = "" } = req.query;
      console.log(`📹 Fetching videos for category: ${category}`);

      // Validate category
      const validCategories = ["training", "New", "Home", "programming", "music", "sports", "news", "Atlanta"];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          error: "Invalid category",
          validCategories: validCategories
        });
      }

      // Fetch from YouTube API
      console.log("🌐 Fetching from YouTube API...");
      const url = `https://${RAPID_API_HOST}/search`;
      const params = {
        q: category,
        part: "snippet",
        maxResults: 5,
        type: "video",
        pageToken,
      };

      const response = await axios.get(url, { ...options, params });
      console.log("✅ YouTube API response received");

      // Transform YouTube data
      const youtubeVideos = response.data.items ? response.data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description || '',
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || DEFAULT_THUMBNAIL_URL,
        source: 'youtube',
        videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      })) : [];

      // Fetch from Database
      console.log("🗄️ Fetching from database...");
      const query = `SELECT * FROM media_files WHERE category = ? ORDER BY created_at DESC`;
      const [rows] = await pool.query(query, [category]);
      console.log(`✅ Found ${rows.length} videos in database`);

      // Transform database data
      const s3Videos = rows.map((row) => ({
        id: `db_${row.id}`,
        title: row.title || 'Untitled',
        description: row.description || '',
        thumbnail: row.thumbnail_url || DEFAULT_THUMBNAIL_URL,
        publishedAt: row.created_at,
        source: 'database',
        videoUrl: row.file_url,
        fileType: row.file_type,
        size: row.size,
        format: row.format,
        tags: row.tags,
        duration: row.duration,
        resolution: row.resolution,
        category: row.category
      }));

      // Combine both arrays
      const allVideos = [...youtubeVideos, ...s3Videos];

      // Return combined response (matches working API structure)
      res.json({
        success: true,
        videos: allVideos,
        youtubeVideos: youtubeVideos,
        s3Videos: s3Videos,
        nextPageToken: response.data.nextPageToken || null,
        totalCount: allVideos.length,
        youtubeCount: youtubeVideos.length,
        databaseCount: s3Videos.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("❌ Error fetching videos:", error);

      res.status(500).json({
        success: false,
        error: "Failed to fetch videos",
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  // ─── SEARCH VIDEOS ACROSS YOUTUBE AND DATABASE ───────────────────────────────
  searchVideos: async (req, res) => {
    setCORSHeaders(res, req);
    try {
      const { q: searchTerm = "", maxResults = 10 } = req.query;
      console.log(`🔍 Searching for: "${searchTerm}"`);

      if (!searchTerm || searchTerm.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Search term is required and cannot be empty"
        });
      }

      const cleanSearchTerm = searchTerm.trim();
      let youtubeVideos = [];
      let dbVideos = [];

      // Search YouTube API
      try {
        const url = `https://${RAPID_API_HOST}/search`;
        const params = {
          q: cleanSearchTerm,
          part: "snippet",
          maxResults: parseInt(maxResults) / 2, // Split results between sources
          type: "video",
        };

        const response = await axios.get(url, { ...options, params });
        if (response.data.items) {
          youtubeVideos = response.data.items.map((item) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description || '',
            channelId: item.snippet.channelId,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            thumbnail: item.snippet.thumbnails?.medium?.url || DEFAULT_THUMBNAIL_URL,
            source: 'youtube',
            videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          }));
        }
      } catch (error) {
        console.warn("⚠️ YouTube search failed:", error.message);
      }

      // Search Database
      try {
        const query = `
          SELECT * FROM media_files
          WHERE
            LOWER(file_name) LIKE ? OR
            LOWER(description) LIKE ? OR
            LOWER(title) LIKE ? OR
            LOWER(category) LIKE ? OR
            LOWER(comments) LIKE ?
          ORDER BY updated_at DESC, created_at DESC
          LIMIT ?
        `;

        const searchPattern = `%${cleanSearchTerm.toLowerCase()}%`;
        const [rows] = await pool.query(query, [
          searchPattern, searchPattern, searchPattern, searchPattern, searchPattern,
          parseInt(maxResults) / 2
        ]);

        dbVideos = rows.map((row) => ({
          id: `db_${row.id}`,
          title: row.title || 'Untitled',
          description: row.description || '',
          fileName: row.file_name,
          category: row.category,
          videoUrl: row.file_url,
          thumbnail: row.thumbnail_url || DEFAULT_THUMBNAIL_URL,
          publishedAt: row.created_at,
          source: 'database'
        }));
      } catch (error) {
        console.warn("⚠️ Database search failed:", error.message);
      }

      // Combine results
      const allResults = [...youtubeVideos, ...dbVideos];

      res.json({
        success: true,
        searchTerm: cleanSearchTerm,
        results: allResults,
        youtubeVideos: youtubeVideos,
        dbVideos: dbVideos,
        totalResults: allResults.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("❌ Error searching videos:", error);
      res.status(500).json({
        success: false,
        error: "Failed to search videos",
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  // ─── GET VIDEO BY ID WITH SOURCE PARAMETER ───────────────────────────────
  getVideoById: async (req, res) => {
    setCORSHeaders(res, req);
    try {
      const { id } = req.params;
      const { source } = req.query;

      if (!id || !source) {
        return res.status(400).json({
          success: false,
          error: "Video ID and source are required"
        });
      }

      let videoData = null;

      if (source === 'youtube') {
        // Fetch YouTube video details
        const url = `https://${RAPID_API_HOST}/videos`;
        const params = { part: "snippet,contentDetails,statistics", id: id };

        const response = await axios.get(url, { ...options, params });

        if (!response.data.items || response.data.items.length === 0) {
          return res.status(404).json({
            success: false,
            error: "YouTube video not found"
          });
        }

        const video = response.data.items[0];
        videoData = {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          channelId: video.snippet.channelId,
          channelTitle: video.snippet.channelTitle,
          publishedAt: video.snippet.publishedAt,
          thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url || DEFAULT_THUMBNAIL_URL,
          videoUrl: `https://www.youtube.com/embed/${video.id}`,
          source: 'youtube',
          viewCount: video.statistics?.viewCount || 0,
          likeCount: video.statistics?.likeCount || 0,
          commentCount: video.statistics?.commentCount || 0,
          duration: video.contentDetails?.duration || 'Unknown',
          tags: video.snippet.tags || [],
          categoryId: video.snippet.categoryId,
        };

      } else if (source === 'database') {
        // Extract numeric ID
        const numericId = id.startsWith('db_') ? id.replace('db_', '') : id;

        if (isNaN(numericId)) {
          return res.status(400).json({
            success: false,
            error: "Invalid database video ID"
          });
        }

        // Fetch from database
        const query = `SELECT * FROM media_files WHERE id = ?`;
        const [rows] = await pool.query(query, [numericId]);

        if (rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: "Database video not found"
          });
        }

        const row = rows[0];
        videoData = {
          id: `db_${row.id}`,
          title: row.title,
          description: row.description,
          thumbnail: row.thumbnail_url || DEFAULT_THUMBNAIL_URL,
          videoUrl: row.file_url,
          source: 'database',
          publishedAt: row.created_at,
          fileName: row.file_name,
          fileType: row.file_type,
          size: row.size,
          format: row.format,
          duration: row.duration,
          resolution: row.resolution,
          category: row.category,
          tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
        };
      }

      res.json({
        success: true,
        video: videoData,
      });

    } catch (error) {
      console.error("❌ Error fetching video details:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch video details",
        message: error.message
      });
    }
  },

  // ─── LEGACY ENDPOINTS (FOR BACKWARD COMPATIBILITY) ───────────────────────────────

  get1UtubeVideoAndDetails: async (req, res) => {
    setCORSHeaders(res, req);
    try {
      const { videoId } = req.params;
      if (!videoId || typeof videoId !== "string") {
        return res.status(400).json({ error: "Invalid video ID" });
      }

      const url = `https://${RAPID_API_HOST}/videos`;
      const params = { part: "snippet,contentDetails,statistics", id: videoId };

      const response = await axios.get(url, { ...options, params });

      if (!response.data.items || response.data.items.length === 0) {
        return res.status(404).json({ error: "Video not found" });
      }

      const video = response.data.items[0];
      const transformedData = {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        channelId: video.snippet.channelId,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        thumbnail: video.snippet.thumbnails.medium.url || DEFAULT_THUMBNAIL_URL,
        duration: video.contentDetails.duration,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
      };

      res.json(transformedData);
    } catch (error) {
      console.error("Error getting video details:", error);
      res.status(500).json({
        error: "Failed to get video details",
        message: error.message,
      });
    }
  },

  get1S3VideoAndDetails: async (req, res) => {
    setCORSHeaders(res, req);
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid video ID" });
      }

      const query = `SELECT * FROM media_files WHERE id = ?`;
      const [rows] = await pool.query(query, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Video not found" });
      }

      const video = rows[0];
      const transformedData = {
        id: video.id,
        title: video.title,
        description: video.description,
        fileUrl: video.file_url,
        thumbnail: video.thumbnail_url || DEFAULT_THUMBNAIL_URL,
        uploadedAt: video.uploaded_at,
      };

      res.json(transformedData);
    } catch (error) {
      console.error("Error fetching S3 video details:", error);
      res.status(500).json({ error: "Failed to fetch video details", message: error.message });
    }
  },

  getChannelDetails: async (req, res) => {
    setCORSHeaders(res, req);
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Channel ID is required" });
      }

      const url = `https://${RAPID_API_HOST}/channels`;
      const params = { part: "snippet,statistics", id };

      const response = await axios.get(url, { ...options, params });
      if (!response.data.items || response.data.items.length === 0) {
        return res.status(404).json({ error: "Channel not found" });
      }

      const channel = response.data.items[0];
      const transformedData = {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails.medium.url,
        subscriberCount: channel.statistics.subscriberCount,
        videoCount: channel.statistics.videoCount,
      };

      res.json(transformedData);
    } catch (error) {
      console.error("Error fetching channel details:", error);
      res.status(500).json({ error: "Failed to fetch channel details", message: error.message });
    }
  },

};

module.exports = videoController;
