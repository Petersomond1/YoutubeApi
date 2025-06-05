import axios from "axios";

// ─── ENVIRONMENT VARIABLES (MATCHING YOUR EXISTING SETUP) ──────────────────────────────────────────────────────
const VIDEOS_BASE_URL = import.meta.env.VITE_VIDEOS_BASE_URL;
const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL;

if (!VIDEOS_BASE_URL || !MEDIA_BASE_URL) {
  console.warn(
    "[fetchFromAPI] One of your VITE_* URLs is missing! " +
    "Make sure .env contains VITE_VIDEOS_BASE_URL & VITE_MEDIA_BASE_URL."
  );
}

// ─── MAIN API FUNCTION (COMPATIBLE WITH YOUR EXISTING CODE) ──────────────────────────────────────────────────────
const fetchFromAPI = async (endpoint, isMedia = false) => {
  const BASE_URL = isMedia ? MEDIA_BASE_URL : VIDEOS_BASE_URL;
  console.log("Fetching from API:", `${BASE_URL}/${endpoint}`);

  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      headers: {
        "Cache-Control": "no-cache",
      },
      params: {
        // append a timestamp to bust any caches
        t: new Date().getTime(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
};

// ─── SPECIALIZED API FUNCTIONS ──────────────────────────────────────────────────────

/**
 * Fetch videos by category using the new endpoint structure
 * @param {string} category - Category to fetch (New, programming, music, etc.)
 * @param {string} pageToken - Optional pagination token
 */
export const fetchVideosByCategory = async (category = "New", pageToken = "") => {
  const endpoint = `all?category=${encodeURIComponent(category)}${pageToken ? `&pageToken=${pageToken}` : ''}`;
  return await fetchFromAPI(endpoint);
};

/**
 * Search videos across YouTube and database
 * @param {string} searchTerm - Search query
 * @param {number} maxResults - Maximum number of results
 */
export const searchVideos = async (searchTerm, maxResults = 10) => {
  const endpoint = `search?q=${encodeURIComponent(searchTerm)}&maxResults=${maxResults}`;
  return await fetchFromAPI(endpoint);
};

/**
 * Get specific video details by ID and source
 * @param {string} videoId - Video ID
 * @param {string} source - 'youtube' or 'database'
 */
export const fetchVideoDetails = async (videoId, source) => {
  const endpoint = `video/${videoId}?source=${source}`;
  return await fetchFromAPI(endpoint);
};

/**
 * Get YouTube channel details
 * @param {string} channelId - YouTube channel ID
 */
export const fetchChannelDetails = async (channelId) => {
  const endpoint = `channels/${channelId}`;
  return await fetchFromAPI(endpoint);
};

/**
 * Upload media file
 * @param {FormData} formData - File data to upload
 */
export const uploadMedia = async (formData) => {
  const BASE_URL = MEDIA_BASE_URL;
  const fullUrl = `${BASE_URL}/upload`;
  
  console.log("📤 Uploading media to:", fullUrl);

  try {
    const response = await axios.post(fullUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 second timeout for uploads
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    });

    console.log("✅ Upload successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Upload failed:", error);
    throw error;
  }
};

/**
 * Generate pre-signed upload URL (legacy support)
 * @param {string} fileName - File name
 * @param {string} fileType - File MIME type
 */
export const generateUploadURL = async (fileName, fileType) => {
  const endpoint = `generate-upload-url?fileName=${encodeURIComponent(fileName)}&fileType=${encodeURIComponent(fileType)}`;
  return await fetchFromAPI(endpoint, true);
};

export { fetchFromAPI };