import { createConnection } from 'mysql2/promise';
import { defineEventHandler, readBody } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  let connection;
  try {
    const { id, password } = await readBody(event);

    // MySQL 연결 설정
    connection = await createConnection({
      host: 'forgurm.iptime.org',  // 직접 호스트 지정
      port: 3306,
      user: 'forgurm',
      password: 'asdfqwer1!',
      database: 'tpsl',
      charset: 'utf8mb4'
    });

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
  } catch (error: any) {
    console.error('로그인 처리 오류:', error);
    return { 
      success: false, 
      message: '서버 오류가 발생했습니다.',
      error: error.message 
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}); 