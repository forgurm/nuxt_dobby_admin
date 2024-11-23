import { pool } from '../../db';
import { defineEventHandler, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  try {
    const [results] = await pool.query<RowDataPacket[]>(`
      SELECT code, name
      FROM common_codes 
      WHERE group_code = 'BOARD_TYPE'
      AND is_deleted = false
    `);

    return { 
      success: true, 
      data: results 
    };
  } catch (error) {
    console.error('Error fetching board types:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
}); 