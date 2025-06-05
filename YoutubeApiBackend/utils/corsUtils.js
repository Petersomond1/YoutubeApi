// YoutubeApiBackend\utils\corsUtils.js
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://youtube.petersomond.com",
    "https://www.youtube.petersomond.com",
    "http://youtubeapi-frontend-statics3.s3-website-us-east-1.amazonaws.com",
    "https://d32z53idds3ccw.cloudfront.net"
  ];
  
  const setCORSHeaders = (res, req) => {
    const origin = req.headers.origin;
  
    // Set CORS headers
    if (allowedOrigins.includes(origin) || !origin) {
      res.header('Access-Control-Allow-Origin', origin || '*');
    }
  
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, X-Requested-With, Accept, Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
  };
  
  module.exports = { setCORSHeaders, allowedOrigins };