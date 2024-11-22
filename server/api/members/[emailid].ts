import { pool } from '../../db';
import { defineEventHandler, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  const emailid = event.context.params.emailid;

  if (event.method === 'GET') {
    try {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE emailid = ?', [emailid]);
      if (rows.length === 0) {
        throw createError({ statusCode: 404, statusMessage: 'User not found' });
      }
      return rows[0];
    } catch (error) {
      console.error('데이터베이스 쿼리 오류:', error);
      throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
    }
  }

  if (event.method === 'DELETE') {
    try {
      const [result] = await pool.query('DELETE FROM users WHERE emailid = ?', [emailid]);
      if (result.affectedRows === 0) {
        throw createError({ statusCode: 404, statusMessage: 'User not found' });
      }
      return { success: true };
    } catch (error) {
      console.error('데이터베이스 삭제 오류:', error);
      throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
}); 