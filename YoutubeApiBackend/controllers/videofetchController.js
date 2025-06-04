const axios = require("axios");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 });
const { pool } = require("../config/db");
const { setCORSHeaders } = require('../utils/corsUtils');

// Use environment variable for API key (security improvement)
const RAPID_API_KEY = process.env.RAPID_API_KEY || "eaf54a6583msh168339a792b7460p16e58fjsn309b077e0b30";
const RAPID_API_HOST = "youtube-v31.p.rapidapi.com";

const options = {
  headers: {
    "X-RapidAPI-Key": RAPID_API_KEY,
    "X-RapidAPI-Host": RAPID_API_HOST,
  }
};

const videoController = {

  getAllVideos: async (req, res) => {
    setCORSHeaders(res, req);
    try {
      const { category = "programming", pageToken = "" } = req.query;

      // Check if the category is valid
      const validCategories = ["training", "New", "Home", "programming", "music", "sports", "news", "Atlanta"];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ 
          success: false,
          error: "Invalid category",
          validCategories: validCategories
        });
      }

      // Fetch from YouTube API
      console.log("Fetching videos from YouTube API for category:", category);
      const url = `https://${RAPID_API_HOST}/search`;
      const params = {
        q: category,
        part: "snippet",
        maxResults: 5,
        type: "video",
        pageToken,
      };

      const response = await axios.get(url, { ...options, params });
      console.log("YouTube API response received");

      if (!response.data.items) {
        throw new Error("No videos found in YouTube API");
      }

      // Transform YouTube data to consistent format
      const youtubeVideos = response.data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description || '',
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
        source: 'youtube',
        videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));

      const nextPageToken = response.data.nextPageToken || null;

      // Fetch from MySQL database
      console.log("Fetching videos from MySQL database for category:", category);
      const query = `SELECT * FROM media_files WHERE category = ? ORDER BY created_at DESC`;
      const [rows] = await pool.query(query, [category]);
      console.log(`Found ${rows.length} videos in database`);

      // Transform database data to consistent format
      const dbVideos = rows.map((row) => ({
        id: `db_${row.id}`,
        title: row.title || 'Untitled',
        description: row.description || '',
        thumbnail: row.thumbnail_url || "default-thumbnail.jpg",
        publishedAt: row.created_at,
        source: 'database',
        videoUrl: row.file_url,
        fileType: row.file_type,
        size: row.size,
        format: row.format,
        tags: row.tags,
        duration: row.duration,
        resolution: row.resolution,
      }));

      // Combine both arrays
      const allVideos = [...youtubeVideos, ...dbVideos];

      // Set cache control headers (optional, for better performance)
      res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes

      // Return combined response
      res.json({
        success: true,
        videos: allVideos,
        youtubeVideos: youtubeVideos,
        s3Videos: dbVideos,
        nextPageToken: nextPageToken,
        totalCount: allVideos.length,
        youtubeCount: youtubeVideos.length,
        databaseCount: dbVideos.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("Error fetching videos:", error);
      
      // Better error response structure
      const errorResponse = {
        success: false,
        error: "Failed to fetch videos",
        message: error.message,
        timestamp: new Date().toISOString()
      };

      // Don't expose internal errors in production
      if (process.env.NODE_ENV !== 'production') {
        errorResponse.stack = error.stack;
      }

      // Return appropriate status code based on error type
      if (error.message.includes('YouTube API')) {
        return res.status(503).json(errorResponse); // Service unavailable
      } else if (error.message.includes('Database')) {
        return res.status(500).json(errorResponse); // Internal server error
      } else {
        return res.status(500).json(errorResponse);
      }
    }
  },

  searchVideos: async (req, res) => {
    setCORSHeaders(res, req);
    try {
      const { searchTerm = "", maxResults = 5 } = req.query;

      if (!searchTerm || searchTerm.trim().length === 0) {
        return res.status(400).json({ 
          success: false,
          error: "Search term is required and cannot be empty" 
        });
      }

      // Sanitize search term
      const cleanSearchTerm = searchTerm.trim();

      // Search YouTube API
      const youtubePromise = (async () => {
        try {
          const cacheKey = `youtube-${cleanSearchTerm}-${maxResults}`;
          const cachedData = cache.get(cacheKey);
          if (cachedData) return cachedData;

          const url = `https://${RAPID_API_HOST}/search`;
          const params = {
            q: cleanSearchTerm,
            part: "snippet",
            maxResults: parseInt(maxResults),
            type: "video",
          };

          const response = await axios.get(url, { ...options, params });
          if (!response.data.items) return [];

          const transformedData = response.data.items.map((item) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description || '',
            channelId: item.snippet.channelId,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            thumbnail: item.snippet.thumbnails?.medium?.url || '',
            source: 'youtube'
          }));

          cache.set(cacheKey, transformedData);
          return transformedData;
        } catch (error) {
          console.warn("YouTube search failed:", error.message);
          return []; // Return empty array if YouTube search fails
        }
      })();

      // Search MySQL database
      const dbPromise = (async () => {
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
            searchPattern,
            searchPattern,
            searchPattern,
            searchPattern,
            searchPattern,
            parseInt(maxResults)
          ]);

          return rows.map((row) => ({
            id: `db_${row.id}`,
            title: row.title || 'Untitled',
            description: row.description || '',
            fileName: row.file_name,
            category: row.category,
            fileUrl: row.file_url,
            thumbnail: row.thumbnail_url || "default-thumbnail.jpg",
            uploadedAt: row.uploaded_at,
            source: 'database'
          }));
        } catch (error) {
          console.warn("Database search failed:", error.message);
          return []; // Return empty array if database search fails
        }
      })();

      // Wait for both promises to resolve
      const [youtubeVideos, dbVideos] = await Promise.all([youtubePromise, dbPromise]);

      res.json({ 
        success: true,
        searchTerm: cleanSearchTerm,
        youtubeVideos, 
        dbVideos,
        totalResults: youtubeVideos.length + dbVideos.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error searching videos:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to search videos", 
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  getVideoById: async (req, res) => {
    setCORSHeaders(res, req);
    try {
      const { id } = req.params;
      const { source } = req.query; // 'youtube' or 'database'

      if (!id || !source) {
        return res.status(400).json({
          success: false,
          error: "Video ID and source are required"
        });
      }

      let videoData = null;

      if (source === 'youtube') {
        // Check cache first
        const cacheKey = `video-${id}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
          console.log("Cache hit for video ID:", id);
          return res.json({
            success: true,
            video: cachedData,
            relatedVideos: []
          });
        }

        // Fetch YouTube video details
        const url = `https://${RAPID_API_HOST}/videos`;
        const params = {
          part: "snippet,contentDetails,statistics",
          id: id,
        };

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
          thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url,
          videoUrl: `https://www.youtube.com/embed/${video.id}`,
          source: 'youtube',
          // Statistics
          viewCount: video.statistics?.viewCount || 0,
          likeCount: video.statistics?.likeCount || 0,
          commentCount: video.statistics?.commentCount || 0,
          // Content details
          duration: video.contentDetails?.duration || 'Unknown',
          definition: video.contentDetails?.definition || 'Unknown',
          // Additional snippet data
          tags: video.snippet.tags || [],
          categoryId: video.snippet.categoryId,
        };

        // Cache the result
        cache.set(cacheKey, videoData, 3600); // Cache for 1 hour

      } else if (source === 'database') {
        // Extract the numeric ID from the prefixed ID (remove 'db_' prefix)
        const numericId = id.startsWith('db_') ? id.replace('db_', '') : id;

        // Validate numeric ID
        if (isNaN(numericId)) {
          return res.status(400).json({
            success: false,
            error: "Invalid database video ID"
          });
        }

        // Fetch from MySQL database
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
          thumbnail: row.thumbnail_url || "default-thumbnail.jpg",
          videoUrl: row.file_url, // Direct S3 URL
          source: 'database',
          publishedAt: row.created_at,
          updatedAt: row.updated_at,
          // File specific details
          fileName: row.file_name,
          fileType: row.file_type,
          size: row.size,
          format: row.format,
          duration: row.duration,
          resolution: row.resolution,
          category: row.category,
          tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
          // Additional metadata
          monetization: row.monetization,
          rightsClaims: row.rights_claims,
          comments: row.comments,
          videoTranscript: row.video_transcript,
          geoCoordinates: row.geo_coordinates,
        };

      } else {
        return res.status(400).json({
          success: false,
          error: "Invalid source. Must be 'youtube' or 'database'"
        });
      }

      // Fetch related videos
      let relatedVideos = [];
      try {
        if (source === 'youtube' && videoData.tags.length > 0) {
          // Get related YouTube videos based on first tag
          const relatedUrl = `https://${RAPID_API_HOST}/search`;
          const relatedParams = {
            q: videoData.tags[0],
            part: "snippet",
            maxResults: 5,
            type: "video",
          };
          const relatedResponse = await axios.get(relatedUrl, { ...options, params: relatedParams });

          if (relatedResponse.data.items) {
            relatedVideos = relatedResponse.data.items
              .filter(item => item.id.videoId !== id) // Exclude current video
              .slice(0, 4) // Limit to 4 related videos
              .map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.medium.url,
                channelTitle: item.snippet.channelTitle,
                publishedAt: item.snippet.publishedAt,
                source: 'youtube',
              }));
          }
        } else if (source === 'database') {
          // Get related database videos from same category
          const relatedQuery = `SELECT * FROM media_files WHERE category = ? AND id != ? LIMIT 4`;
          const [relatedRows] = await pool.query(relatedQuery, [videoData.category || 'New', numericId]);

          relatedVideos = relatedRows.map(row => ({
            id: `db_${row.id}`,
            title: row.title,
            description: row.description,
            thumbnail: row.thumbnail_url || "default-thumbnail.jpg",
            source: 'database',
            publishedAt: row.created_at,
          }));
        }
      } catch (relatedError) {
        console.warn("Failed to fetch related videos:", relatedError.message);
        // Continue without related videos
      }

      res.json({
        success: true,
        video: videoData,
        relatedVideos: relatedVideos,
      });

    } catch (error) {
      console.error("Error fetching video details:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch video details",
        message: error.message
      });
    }
  },


  // Get detailed information about a specific video
  get1UtubeVideoAndDetails: async (req, res) => {
    setCORSHeaders(res, req);
    try {
      const { videoId } = req.params;
      if (!videoId || typeof videoId !== "string") {
        return res.status(400).json({ error: "Invalid video ID" });
      }
      // Check if the video ID is already cached
      const cacheKey = `video-${videoId}`;
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log("Cache hit for video ID:", videoId);
        return res.json(cachedData);
      }
      console.log("Cache miss for video ID:", videoId);

      // Fetch video details from YouTube API
      console.log("@get1Utube video id", videoId);
      const url = `https://${RAPID_API_HOST}/videos`;
      const params = {
        part: "snippet,contentDetails,statistics",
        id: videoId,
      };

      const response = await axios.get(url, { ...options, params });
      console.log("response from getVideoDetails", response.data);
      if (!response.data.items || response.data.items.length === 0) {
        console.error("Video not found");
        return res.status(404).json({ error: "Video not found" });
      }

      const video = response.data.items[0];

      // Transform the data
      const transformedData = {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      channelId: video.snippet.channelId,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      thumbnail: video.snippet.thumbnails.medium.url,
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
      // Fetching metadata from MySQL database
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
        thumbnail: video.thumbnail_url || "default-thumbnail.jpg",
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
