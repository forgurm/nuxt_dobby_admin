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

    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT exchange_name, symbol_name FROM symbols'
    );

    return rows;
  } catch (error) {
    console.error('심볼 조회 오류:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}); 