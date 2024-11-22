import { pool } from '../../db';
import { defineEventHandler, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT no AS id, name, emailid, referral_exchange AS exchange, referral_code, status, lv AS level
      FROM users
    `);
    return rows;
  } catch (error) {
    console.error('데이터베이스 쿼리 오류:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
}); 