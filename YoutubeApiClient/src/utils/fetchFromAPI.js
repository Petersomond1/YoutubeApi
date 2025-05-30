// youtubefrontApi\youtubefront\src\utils\fetchFromAPI.js
import axios from "axios";

const VIDEOS_BASE_URL = process.env.REACT_APP_API_VIDEOS_URL || "http://localhost:5000/api/videos";
const MEDIA_BASE_URL = process.env.REACT_APP_API_MEDIA_URL || "http://localhost:5000/api/media";

const fetchFromAPI = async (endpoint, isMedia = false) => {
  const BASE_URL = isMedia ? MEDIA_BASE_URL : VIDEOS_BASE_URL;

  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      headers: {
        "Cache-Control": "no-cache",
      },
      params: {
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