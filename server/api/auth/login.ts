import { createConnection } from 'mysql2/promise';
import { defineEventHandler, readBody } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  const { id, password } = await readBody(event);

  // MySQL 데이터베이스 연결 설정
  const connection = await createConnection({
    host: process.env.DB_HOST, // 환경 변수 사용
    user: process.env.DB_USER, // 환경 변수 사용
    password: process.env.DB_PASSWORD, // 환경 변수 사용
    database: process.env.DB_NAME, // 환경 변수 사용
  });

  try {
    // 사용자 인증 쿼리
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE emailid = ? AND password = ?',
      [id, password]
    );

    if (rows.length > 0) {
      // 인증 성공
      return { success: true, message: '로그인 성공', user: { lv: rows[0].lv } };
    } else {
      // 인증 실패
      return { success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' };
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    return { success: false, message: '서버 오류가 발생했습니다.' };
  } finally {
    await connection.end();
  }
}); 