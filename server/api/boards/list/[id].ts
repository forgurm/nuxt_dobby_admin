import { pool } from '../../../db';
import { defineEventHandler, readBody, createError } from 'h3';
import type { ResultSetHeader } from 'mysql2';

export default defineEventHandler(async (event) => {
  // POST 요청 처리 (게시판 추가)
  if (event.method === 'POST') {
    const body = await readBody(event);
    
    if (!body.name || !body.type_code) {
      throw createError({
        statusCode: 400,
        message: '필수 항목이 누락되었습니다.',
      });
    }

    try {
      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO boards (name, type_code, created_at, updated_at)
         VALUES (?, ?, NOW(), NOW())`,
        [body.name, body.type_code]
      );

      return { 
        success: true, 
        message: '게시판이 추가되었습니다.',
        data: { id: result.insertId }
      };
    } catch (error) {
      console.error('Error creating board:', error);
      throw createError({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }

  const id = event.context.params?.id;
  
  // DELETE 요청 처리
  if (event.method === 'DELETE') {
    if (!id) {
      throw createError({
        statusCode: 400,
        message: '게시판 ID가 필요합니다.',
      });
    }

    try {
      const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE boards 
         SET is_deleted = true, updated_at = NOW()
         WHERE id = ?`,
        [id]
      );

      return { 
        success: true, 
        message: '게시판이 삭제되었습니다.' 
      };
    } catch (error) {
      console.error('Error deleting board:', error);
      throw createError({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }
  
  // PUT 요청 처리
  if (event.method === 'PUT') {
    const body = await readBody(event);

    if (!id || !body.name || !body.type_code) {
      throw createError({
        statusCode: 400,
        message: '필수 항목이 누락되었습니다.',
      });
    }

    try {
      const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE boards 
         SET name = ?, type_code = ?, updated_at = NOW()
         WHERE id = ? AND is_deleted = false`,
        [body.name, body.type_code, id]
      );

      if (result.affectedRows === 0) {
        throw createError({
          statusCode: 404,
          message: '해당 게시판을 찾을 수 없습니다.',
        });
      }

      return { 
        success: true, 
        message: '게시판이 수정되었습니다.' 
      };
    } catch (error) {
      console.error('Error updating board:', error);
      throw createError({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }
}); 