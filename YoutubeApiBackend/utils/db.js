import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

// console.log('Attempting to connect to the database with the following configuration:');
// console.log({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306,
// });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// (async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log('Database connection established successfully.');
//     connection.release();
//   } catch (err) {
//     console.error('Failed to connect to the database:', err.message);
//     process.exit(1);
//   }
// })();

export { pool };