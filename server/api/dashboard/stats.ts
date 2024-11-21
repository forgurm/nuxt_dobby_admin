import { defineEventHandler, createError } from 'h3';
import type { RowDataPacket } from 'mysql2';
import { pool } from '../../db';

interface DashboardStats {
  members: {
    total: number;
    active: number;
    inactive: number;
  };
  activeClients: number;
  symbols: {
    total: number;
    empty: number;
    exchanges: {
      name: string;
      count: number;
      nullCount: number;
    }[];
  };
  bots: {
    total: number;
    active: number;
    inactive: number;
  };
}

export default defineEventHandler(async (event) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // 활성 클라이언트 수
    const [activeClientStats] = await connection.query<RowDataPacket[]>(
      'SHOW STATUS LIKE "Threads_connected"'
    );
    

    // 멤버 통계
    const [memberStats] = await connection.query<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status != 'active' THEN 1 ELSE 0 END) as inactive
      FROM users
    `);

    // 심볼 통계
    const [symbolStats] = await connection.query<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN symbol_name IS NULL OR symbol_name = '' THEN 1 ELSE 0 END) as empty_count
      FROM exchange_info
    `);

    // 거래소별 심볼 통계
    const [exchangeStats] = await connection.query<RowDataPacket[]>(`
      WITH exchange_stats AS (
        SELECT 
          exchange_code,
          symbol_name,
          COUNT(*) OVER (PARTITION BY exchange_code) as total_count,
          CASE WHEN symbol_name IS NULL OR symbol_name = '' THEN 1 ELSE 0 END as is_null
        FROM exchange_info
      )
      SELECT 
        exchange_code as name,
        MAX(total_count) as count,
        SUM(is_null) as null_count
      FROM exchange_stats
      GROUP BY exchange_code
      ORDER BY SUM(is_null) DESC, exchange_code ASC
    `);

    // 봇 통계
    const [botStats] = await connection.query<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status != 'active' THEN 1 ELSE 0 END) as inactive
      FROM bot_info
    `);

    const stats: DashboardStats = {
      activeClients: Number(activeClientStats[0]?.Value) || 0,
      members: {
        total: memberStats[0]?.total || 0,
        active: memberStats[0]?.active || 0,
        inactive: memberStats[0]?.inactive || 0
      },
      symbols: {
        total: symbolStats[0]?.total || 0,
        empty: symbolStats[0]?.empty_count || 0,
        exchanges: exchangeStats.map(ex => ({
          name: ex.name,
          count: ex.count,
          nullCount: ex.null_count
        }))
      },
      bots: {
        total: botStats[0]?.total || 0,
        active: botStats[0]?.active || 0,
        inactive: botStats[0]?.inactive || 0
      }
    };

    return { 
      success: true, 
      data: stats 
    };
  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error);
    throw createError({ 
      statusCode: 500, 
      statusMessage: '대시보드 통계 조회 중 오류가 발생했습니다.' 
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}); 