const axios = require('axios');
const AWS = require('aws-sdk');
const { S3_BUCKET, YOUTUBE_API_KEY } = process.env;

// Setup AWS S3
const s3 = new AWS.S3();

// Fetch from YouTube API
const fetchFromYoutube = async (req, res) => {
  const { searchTerm } = req.params;
  
  const url = `https://youtube-v31.p.rapidapi.com/search?part=snippet&q=${searchTerm}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': YOUTUBE_API_KEY,
      'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.get(url, options);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching YouTube data');
  }
};

// Fetch media from S3
const fetchFromS3 = async (req, res) => {
  const { searchTerm } = req.params;
  const params = {
    Bucket: S3_BUCKET,
    Prefix: searchTerm,  // Search term could be used to filter media
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    res.json(data);
  } catch (error) {
    res.status(500).send('Error fetching media from S3');
  }
};

module.exports = { fetchFromYoutube, fetchFromS3 };
