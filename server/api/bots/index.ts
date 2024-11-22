import { pool } from '../../db';
import { defineEventHandler, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT * FROM bot_info
    `);

    if (rows.length === 0) {
      return { success: false, message: '봇 인덱스 목록이 없습니다.' };
    }

    return { success: true, data: rows };
  } catch (error) {
    console.error('데이터베이스 쿼리 오류:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
}); 