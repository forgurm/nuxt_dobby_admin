import { defineEventHandler, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';
import { pool } from '../../../db';

interface SymbolRow extends RowDataPacket {
  exchange_name: string;
  symbol_code: string;
  symbol_name: string;
  total_count: number;
  empty_count: number;
}

export default defineEventHandler(async (event) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [rows] = await connection.query<SymbolRow[]>(`
      SELECT 
        ei.exchange_code as exchange_name,
        ei.symbol_code,
        ei.symbol_name,
        e.total_count,
        e.empty_count
      FROM exchange_info ei
      LEFT JOIN (
        SELECT 
          exchange_code,
          COUNT(symbol_code) as total_count,
          SUM(CASE WHEN symbol_name IS NULL OR symbol_name = '' THEN 1 ELSE 0 END) as empty_count
        FROM exchange_info
        GROUP BY exchange_code
      ) e ON ei.exchange_code = e.exchange_code
      ORDER BY 
        CASE WHEN ei.symbol_name IS NULL OR ei.symbol_name = '' THEN 0 ELSE 1 END,  -- NULL이 먼저 오도록
        ei.exchange_code ASC,
        ei.symbol_code ASC
    `);

    return { 
      success: true, 
      data: Array.isArray(rows) ? rows : []
    };
  } catch (error) {
    console.error('데이터베이스 쿼리 오류:', error);
    throw createError({ 
      statusCode: 500, 
      statusMessage: '데이터베이스 조회 중 오류가 발생했습니다.' 
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}); 