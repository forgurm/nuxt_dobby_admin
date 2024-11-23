import { pool } from '../../../db';
import { defineEventHandler, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  try {
    const [results] = await pool.query<RowDataPacket[]>(`
      SELECT 
        id,
        name,
        type_code,
        created_at,
        updated_at
      FROM boards 
      WHERE is_deleted = 0
      ORDER BY created_at DESC
    `);

    if (results.length === 0) {
      return { success: false, message: '게시판 목록이 없습니다.' };
    }

    return { success: true, data: results };
  } catch (error) {
    console.error('Error fetching boards:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
}); 