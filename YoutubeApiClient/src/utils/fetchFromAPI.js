// youtubefrontApi\youtubefront\src\utils\fetchFromAPI.js
import axios from "axios";

// ← Replace the hard‐coded strings with your Vite env vars:
const VIDEOS_BASE_URL = import.meta.env.VITE_VIDEOS_BASE_URL;
const MEDIA_BASE_URL  = import.meta.env.VITE_MEDIA_BASE_URL;

if (!VIDEOS_BASE_URL || !MEDIA_BASE_URL) {
  console.warn(
    "[fetchFromAPI] One of your VITE_* URLs is missing! " +
    "Make sure .env contains VITE_VIDEOS_BASE_URL & VITE_MEDIA_BASE_URL."
  );
}

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

export { fetchFromAPI };
