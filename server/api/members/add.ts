import { pool } from '../../db';
import { defineEventHandler, readBody, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, password, phone, address1, address2, exchange, referralCode, status, level, memo, recommender } = body;

  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, emailid, password, phone, add1, add2, referral_exchange, referral_code, status, lv, memo, recommand_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, password, phone, address1, address2, exchange, referralCode, status, level, memo, recommender]
    );
    return { success: true, id: result.insertId };
  } catch (error) {
    console.error('데이터베이스 삽입 오류:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
}); 