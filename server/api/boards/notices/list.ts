import { pool } from '../../../db';
import { defineEventHandler, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  try {
    const [results] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        id,
        title,
        exposure_type,
        board_ids,
        expire_date,
        created_at,
        updated_at
      FROM notices 
      ORDER BY 
        CASE 
          WHEN exposure_type = 'FIXED' THEN 0 
          ELSE 1 
        END,
        created_at DESC
    `);

    return { 
      success: true, 
      data: results 
    };
  } catch (error) {
    console.error('Error fetching notices:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
}); 