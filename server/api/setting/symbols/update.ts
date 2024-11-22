import { pool } from '../../../db';
import { defineEventHandler, readBody, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { exchange_name, symbol_code, symbol_name } = body;

  try {
    console.log('업데이트 요청:', body);
    const [result] = await pool.query(
      'UPDATE exchange_info SET symbol_name = ? WHERE exchange_name = ? AND symbol_code = ?',
      [symbol_name, exchange_name, symbol_code]
    );
    console.log('업데이트 결과:', result);
    return { success: true };
  } catch (error) {
    console.error('데이터베이스 업데이트 오류:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
}); 