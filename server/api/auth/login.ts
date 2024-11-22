import { pool } from '../../db';
import { defineEventHandler, readBody, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const [results] = await pool.query<RowDataPacket[]>(`
      SELECT * FROM users WHERE emailid = ? AND password = ?
    `, [body.id, body.password]);

    if (results.length > 0) {
      return { 
        success: true, 
        message: '로그인 성공', 
        user: { 
          lv: results[0].lv,
          emailid: results[0].emailid 
        } 
      };
    } else {
      return { 
        success: false, 
        message: '아이디 또는 비밀번호가 잘못되었습니다.' 
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
}); 