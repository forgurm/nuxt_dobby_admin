import { createConnection } from 'mysql2/promise';
import { defineEventHandler } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async () => {
  let connection;
  try {
    connection = await createConnection({
      host: 'forgurm.iptime.org',
      port: 3306,
      user: 'forgurm',
      password: 'asdfqwer1!',
      database: 'tpsl',
      charset: 'utf8mb4'
    });

    // 전체 회원수
    const [totalRows] = await connection.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM users'
    );
    
    // 레퍼럴 사용자 수
    const [referralRows] = await connection.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM users WHERE referral_code IS NOT NULL'
    );

    // 미사용자 수
    const [inactiveRows] = await connection.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM users WHERE last_login < DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );

    // 영업 회원수
    const [salesRows] = await connection.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM users WHERE lv = 5'
    );

    // 차단된 회원수
    const [blockedRows] = await connection.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM users WHERE is_blocked = 1'
    );

    // 활성 클라이언트 수
    const [activeClientRows] = await connection.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM users WHERE last_login > DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );

    return {
      total: totalRows[0].count,
      referral: referralRows[0].count,
      inactive: inactiveRows[0].count,
      sales: salesRows[0].count,
      blocked: blockedRows[0].count,
      active_client: activeClientRows[0].count
    };
  } catch (error) {
    console.error('회원수 조회 오류:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});