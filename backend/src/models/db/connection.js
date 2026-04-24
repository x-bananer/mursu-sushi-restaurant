import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Simple standalone queries
 */
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.SUSHI_RESTAURANT_DB_USER,
  password: process.env.SUSHI_RESTAURANT_DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

/**
 * Transaction wrapper for multi-step logic
 */
export async function withTransaction(callback) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const result = await callback(conn);

    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
