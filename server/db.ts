import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// .env 파일의 환경 변수를 process.env로 로드
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});