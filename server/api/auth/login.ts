import { createConnection } from 'mysql2/promise';
import { defineEventHandler, readBody } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  try {
    const { id, password } = await readBody(event);

    // MySQL 데이터베이스 연결 설정
    const connection = await createConnection({
      host: process.env.DB_HOST || 'forgurm.iptime.org',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'forgurm',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'tpsl',
      charset: process.env.DB_FONT || 'utf8mb4'
    });

    try {
      // 사용자 인증 쿼리
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE emailid = ? AND password = ?',
        [id, password]
      );

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
    } finally {
      await connection.end();
    }
  } catch (error: any) {
    console.error('로그인 처리 오류:', error);
    return { 
      success: false, 
      message: '서버 오류가 발생했습니다.',
      error: error.message 
    };
  }
}); 