import { createPool } from 'mysql2/promise'

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

interface CountResult {
  total: number
  referral: number
  inactive: number
  sales: number
  blocked: number
}

export default defineEventHandler(async (event) => {
  try {
    const [rows] = await pool.query<CountResult[]>('SELECT COUNT(*) as total FROM users')
    const [referralRows] = await pool.query<CountResult[]>('SELECT COUNT(*) as referral FROM users WHERE lv = 1')
    const [inactiveRows] = await pool.query<CountResult[]>('SELECT COUNT(*) as inactive FROM users WHERE lv = 0')
    const [salesRows] = await pool.query<CountResult[]>('SELECT COUNT(*) as sales FROM users WHERE lv = 5')
    const [blockedRows] = await pool.query<CountResult[]>('SELECT COUNT(*) as blocked FROM users WHERE lv = 9')
    const [activeClientRows] = await pool.query('SHOW STATUS LIKE "Threads_connected"')

    const active_client = parseInt(activeClientRows[0].Value, 10);

    return {
      total: rows[0].total,
      referral: referralRows[0].referral,
      inactive: inactiveRows[0].inactive,
      sales: salesRows[0].sales,
      blocked: blockedRows[0].blocked,
      active_client,
    }
  } catch (error) {
    console.error('데이터베이스 쿼리 오류:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }
})