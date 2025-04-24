import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });


// Create the pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query('SELECT 1 + 1 AS result');
    console.log("Database connection established successfully. Query result:", results[0].result);
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("Failed to connect to the database:", err.message);
    process.exit(1); // Exit the process if the database connection fails
  }
});

// Use the ES module export syntax to export pool
export { pool };
