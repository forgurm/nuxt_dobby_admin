import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default defineEventHandler(async (event) => {
  try {
    const [rows] = await pool.query(`
      SELECT exchange_name, exchange_code, symbol_name, symbol_code,
             COUNT(*) OVER (PARTITION BY exchange_name) AS total_count,
             SUM(CASE WHEN symbol_name IS NULL OR symbol_name = '' THEN 1 ELSE 0 END) OVER (PARTITION BY exchange_name) AS empty_count
      FROM exchange_info
      ORDER BY (symbol_name IS NULL OR symbol_name = '') DESC, symbol_code
    `);
    return rows;
  } catch (error) {
    console.error('데이터베이스 쿼리 오류:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
}); 