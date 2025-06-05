// YoutubeApiBackend\middlewares\validateApiKey.js
const validateApiKey = (req, res, next) => {
    const apiKey = process.env.RAPID_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'API key not configured',
        message: 'RapidAPI key is missing from environment variables'
      });
    }

    next();
  };

  module.exports = validateApiKey;