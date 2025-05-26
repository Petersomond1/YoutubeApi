// youtubefrontApi\youtubefront\src\utils\fetchFromAPI.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/videos";

const fetchFromAPI = async (endpoint) => {
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