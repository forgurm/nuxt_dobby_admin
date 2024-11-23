import { defineEventHandler, readBody, createError } from 'h3';
import { pool } from '../../../db';
import type { ResultSetHeader } from 'mysql2';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log('업데이트 요청:', body); // 요청 데이터 로깅

  if (!body.exchange_name || !body.symbol_code || !body.symbol_name) {
    throw createError({
      statusCode: 400,
      message: '필수 파라미터가 누락되었습니다.',
    });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.execute<ResultSetHeader>(`
      UPDATE exchange_info 
      SET symbol_name = ?
      WHERE exchange_code = ? AND symbol_code = ?
    `, [
      body.symbol_name,
      body.exchange_name,
      body.symbol_code
    ]);

    console.log('업데이트 결과:', result); // 쿼리 실행 결과 로깅

    await connection.commit();

    return {
      success: true,
      message: '심볼이 업데이트되었습니다.',
      data: result
    };
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('심볼 업데이트 실패:', error);
    throw createError({
      statusCode: 500,
      message: '심볼 업데이트 중 오류가 발생했습니다.',
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}); 