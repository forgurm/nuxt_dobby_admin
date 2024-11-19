import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default defineEventHandler(async (event) => {
  try {
    const [rows] = await pool.query('SELECT name, status, location, bot_id FROM bot_info');
    return rows;
  } catch (error) {
    console.error('데이터베이스 쿼리 오류:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
}); 