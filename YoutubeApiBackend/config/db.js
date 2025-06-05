//  YoutubeApiBackend\config\db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment-specific configuration
dotenv.config({ path: process.env.NODE_ENV === 'production' ? './.env.production' : './.env' });

// Log database configuration in development
if (process.env.NODE_ENV !== 'production') {
  console.log('Attempting to connect to the database with the following configuration:');
  console.log({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  });
}

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10, // Default to 10 connections
  queueLimit: process.env.DB_QUEUE_LIMIT || 0, // Default to unlimited queue
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined, // Enable SSL if required
});

// Test the database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection established successfully.');
    connection.release();
  } catch (err) {
    console.error('❌ Failed to connect to the database:', process.env.NODE_ENV === 'production' ? 'Error connecting to the database.' : err.message);
    process.exit(1); // Exit the process if the database connection fails
  }
})();

module.exports = { pool };