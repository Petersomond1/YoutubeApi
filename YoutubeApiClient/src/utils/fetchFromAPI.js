//  const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

//  const options = {
//    method: 'GET',
//    headers: {
//      'X-RapidAPI-Key': import.meta.env.VITE_APP_API_KEY, // The KEY variable didn't work, its not available at runtime. It must be prefixed with REACT_APP_ and added to the .env file.
//      'X-RapidAPI-Host': 'https://youtube-v31.p.rapidapi.com'
//    }
//  };
//  export const fetchFromAPI = async (url) => {
//    const response = await fetch(`${BASE_URL}/${url}`, options);
//    const data = await response.json();

//    return data;
//   };




  //axios fetch

//  const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

//   import axios from 'axios';

//   const options = {
//     method: 'GET',
  
//     params: {
      
//       maxResults: '50',
//     },
//     headers: {
//       'X-RapidAPI-Key': 'eaf54a6583msh168339a792b7460p16e58fjsn309b077e0b30',
//       'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
//     }
//   };
  
//   export const fetchFromAPI = async (url) => {
//   const { data } = await axios.get(`${BASE_URL}/${url}`, options);
//   return data;
//   } 
// =========================================================

// import axios from 'axios';


// const BASE_URL = 'http://localhost:3000/api/media';  // Backend URL

// export const fetchFromAPI = async (url) => {
//   const { data } = await axios.get(`${BASE_URL}/${url}`);
//   return data;
// };

// ==========================================================

// import axios from 'axios';

// const baseUrl = `http://50.17.132.144/api/media`
// export const fetchFromAPI = async (url) => {
//   try {
//   const { data } = await axios.get(`${baseUrl}/${url}`);
//   return data;
// } catch (error) {
//   console.error('Error fetching data:', error);
//   throw error;
// }
// };

import axios from 'axios';

// Base URL for API calls
//const baseUrl = `http://50.17.132.144/api/media`;
const baseUrl = 'https://www.youtube.petersomond.com/api/media';

// Fetch function to call both backend and YouTube API
export const fetchFromAPI = async (url) => {
  try {
    // Check if the URL is for YouTube or S3
    if (url.startsWith('youtube/')) {
      const { data } = await axios.get(`https://youtube-v31.p.rapidapi.com/${url.replace('youtube/', '')}`, {
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_APP_API_KEY,  // Using your API Key from the .env file
          'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
        },
      });
      return data;
    }
    // Fetching from S3 (backend route)
    const { data } = await axios.get(`${baseUrl}/${url}`);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
