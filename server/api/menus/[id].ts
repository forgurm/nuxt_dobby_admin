import { pool } from '../../db';
import { defineEventHandler, readBody, createError } from 'h3';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  // GET 요청 처리 (상세 조회)
  if (event.method === 'GET') {
    try {
      const [results] = await pool.execute<RowDataPacket[]>(`
        SELECT * FROM menus WHERE id = ?
      `, [id]);

      if (results.length === 0) {
        throw createError({
          statusCode: 404,
          message: '메뉴를 찾을 수 없습니다.',
        });
      }

      return { 
        success: true, 
        data: results[0]
      };
    } catch (error) {
      console.error('Error fetching menu:', error);
      throw createError({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }

  // POST 요청 처리 (등록)
  if (event.method === 'POST') {
    const body = await readBody(event);

    try {
      const [result] = await pool.execute<ResultSetHeader>(`
        INSERT INTO menus (
          name, code, parent_id, level, sort_order, 
          user_level, is_visible, path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        body.name,
        body.code,
        body.parent_id || null,
        body.level || 1,
        body.sort_order || 0,
        body.user_level || 0,
        body.is_visible ?? true,
        body.path
      ]);

      return { 
        success: true, 
        message: '메뉴가 등록되었습니다.',
        data: { id: result.insertId }
      };
    } catch (error) {
      console.error('Error creating menu:', error);
      throw createError({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }

  // PUT 요청 처리 (수정)
  if (event.method === 'PUT') {
    const body = await readBody(event);

    try {
      const [result] = await pool.execute<ResultSetHeader>(`
        UPDATE menus 
        SET 
          name = ?,
          code = ?,
          parent_id = ?,
          level = ?,
          sort_order = ?,
          user_level = ?,
          is_visible = ?,
          path = ?
        WHERE id = ?
      `, [
        body.name,
        body.code,
        body.parent_id || null,
        body.level || 1,
        body.sort_order || 0,
        body.user_level || 0,
        body.is_visible ?? true,
        body.path,
        id
      ]);

      return { 
        success: true, 
        message: '메뉴가 수정되었습니다.' 
      };
    } catch (error) {
      console.error('Error updating menu:', error);
      throw createError({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }

  // DELETE 요청 처리
  if (event.method === 'DELETE') {
    try {
      await pool.execute(`DELETE FROM menus WHERE id = ?`, [id]);
      return { 
        success: true, 
        message: '메뉴가 삭제되었습니다.' 
      };
    } catch (error) {
      console.error('Error deleting menu:', error);
      throw createError({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }
}); 