import { createPool } from 'mysql2/promise';
import { defineEventHandler, readBody, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default defineEventHandler(async (event) => {
  try {
    const { id, password } = await readBody(event);

    // 사용자 인증 쿼리
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT * FROM users WHERE emailid = ? AND password = ?
    `, [id, password]);

    // 쿼리 결과 처리
    if (rows.length > 0) {
      return { 
        success: true, 
        message: '로그인 성공', 
        user: { 
          lv: rows[0].lv,
          emailid: rows[0].emailid 
        } 
      };
    } else {
      return { 
        success: false, 
        message: '아이디 또는 비밀번호가 잘못되었습니다.' 
      };
    }
  } catch (error: any) {
    console.error('로그인 처리 오류:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
}); 