import { pool } from '../../db';
import { defineEventHandler, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

interface CountResult extends RowDataPacket {
  count: number;
}

export default defineEventHandler(async (event) => {
  try {
    const [results] = await pool.query<CountResult[]>(`
      SELECT COUNT(*) AS count FROM users
    `);

    if (!Array.isArray(results) || results.length === 0) {
      return { success: false, message: '사용자 수를 가져올 수 없습니다.' };
    }

    return { success: true, data: results[0].count };
  } catch (error) {
    console.error('Error getting member count:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
});