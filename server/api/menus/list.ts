import { pool } from '../../db';
import { defineEventHandler, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  try {
    const [results] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        id,
        name,
        code,
        parent_id,
        level,
        sort_order,
        user_level,
        is_visible,
        path,
        created_at,
        updated_at
      FROM menus
      ORDER BY sort_order ASC
    `);

    return { 
      success: true, 
      data: results 
    };
  } catch (error) {
    console.error('Error fetching menus:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
}); 