//youtube_api\config\S3.js
require('dotenv').config(); 
const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");


const S3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Proper test using ListBucketsCommand
const testS3Connection = async () => {
  try {
    const command = new ListBucketsCommand();
    const response = await S3.send(command);
    console.log("✅ S3 client connected. Buckets found:", response.Buckets.map(b => b.Name).join(", "));
  } catch (error) {
    console.error("❌ S3 initialization failed:", error.message);
  }
};

module.exports = { S3, testS3Connection };
