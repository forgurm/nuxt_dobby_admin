import { pool } from '../../../db';
import { defineEventHandler, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  try {
    const [results] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        id,
        title,
        content,
        version,
        is_required,
        created_at,
        updated_at
      FROM terms
      ORDER BY created_at DESC
    `);

    return { 
      success: true, 
      data: results 
    };
  } catch (error) {
    console.error('Error fetching terms:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
}); 