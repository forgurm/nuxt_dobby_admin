import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

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