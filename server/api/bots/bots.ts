import { pool } from '../../db';
import { defineEventHandler, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  try {
    const [results] = await pool.query<RowDataPacket[]>(`
      SELECT * FROM bot_info
    `);

    if (results.length === 0) {
      return { success: false, message: '봇 목록이 없습니다.' };
    }

    return { success: true, data: results };
  } catch (error) {
    console.error('Error fetching bots:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
}); 