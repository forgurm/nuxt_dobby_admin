import { pool } from '../../db';
import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  // 입력된 데이터 확인
  console.log('Login attempt with:', { email, password });

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE emailid = ? AND password = ?',
      [email, password]
    );

    // 쿼리 결과 확인
    console.log('Query result:', rows);

    if (rows.length > 0) {
      return { success: true, user: rows[0] };
    } else {
      return { success: false, message: 'Invalid email or password' };
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
}); 