import { createPool } from 'mysql2/promise';
import { defineEventHandler, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

interface CountResult extends RowDataPacket {
  count: number;
}

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default defineEventHandler(async (event) => {
  try {
    const [rows] = await pool.query<CountResult[]>(`
      SELECT COUNT(*) AS count FROM users
    `);

    if (!Array.isArray(rows) || rows.length === 0) {
      return { success: false, message: '사용자 수를 가져올 수 없습니다.' };
    }

    return { success: true, data: rows[0].count };
  } catch (error) {
    console.error('데이터베이스 쿼리 오류:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});