import { pool } from '../../../db';
import { defineEventHandler, readBody, createError } from 'h3';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

interface TermResponse {
  success: boolean;
  data?: {
    id: number;
    title: string;
    content: string;
    version: string;
    is_required: boolean;
    created_at: string;
    updated_at: string;
  };
  message?: string;
}

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  // GET 요청 처리 (상세 조회)
  if (event.method === 'GET') {
    try {
      const [results] = await pool.execute<RowDataPacket[]>(`
        SELECT 
          id,
          title,
          content,
          version,
          is_required,
          created_at,
          updated_at
        FROM terms
        WHERE id = ?
      `, [id]);

      if (results.length === 0) {
        throw createError({
          statusCode: 404,
          message: '약관을 찾을 수 없습니다.',
        });
      }

      return { 
        success: true, 
        data: results[0]
      };
    } catch (error) {
      console.error('Error fetching term:', error);
      throw createError({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }

  // POST 요청 처리 (등록)
  if (event.method === 'POST') {
    const body = await readBody(event);
    console.log('Received POST data:', body); // 수신된 데이터 로깅

    try {
      const [result] = await pool.execute<ResultSetHeader>(`
        INSERT INTO terms (
          title, content, version, is_required, created_at, updated_at
        ) VALUES (?, ?, ?, ?, NOW(), NOW())
      `, [
        body.title || '',
        body.content || '',
        body.version || '1.0',
        body.is_required || false
      ]);

      console.log('Insert result:', result); // 쿼리 실행 결과 로깅

      return { 
        success: true, 
        message: '약관이 등록되었습니다.',
        data: { id: result.insertId }
      };
    } catch (error) {
      console.error('Error creating term:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : 'Internal Server Error',
      });
    }
  }

  // PUT 요청 처리 (수정)
  if (event.method === 'PUT') {
    const body = await readBody(event);

    try {
      const [result] = await pool.execute<ResultSetHeader>(`
        UPDATE terms 
        SET 
          title = ?,
          content = ?,
          version = ?,
          is_required = ?,
          updated_at = NOW()
        WHERE id = ?
      `, [
        body.title || '',
        body.content || '',
        body.version || '1.0',
        body.is_required || false,
        id
      ]);

      if (result.affectedRows === 0) {
        throw createError({
          statusCode: 404,
          message: '약관을 찾을 수 없습니다.',
        });
      }

      return { 
        success: true, 
        message: '약관이 수정되었습니다.' 
      };
    } catch (error) {
      console.error('Error updating term:', error);
      throw createError({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }

  // DELETE 요청 처리
  if (event.method === 'DELETE') {
    if (!id) {
      throw createError({
        statusCode: 400,
        message: '약관 ID가 필요합니다.',
      });
    }

    try {
      const [result] = await pool.execute<ResultSetHeader>(`
        DELETE FROM terms 
        WHERE id = ?
      `, [id]);

      if (result.affectedRows === 0) {
        throw createError({
          statusCode: 404,
          message: '약관을 찾을 수 없습니다.',
        });
      }

      return { 
        success: true, 
        message: '약관이 삭제되었습니다.' 
      };
    } catch (error) {
      console.error('Error deleting term:', error);
      throw createError({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }
}); 