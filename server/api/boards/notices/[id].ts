import { pool } from '../../../db';
import { defineEventHandler, readBody, createError } from 'h3';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

interface NoticeResponse {
  success: boolean;
  data?: {
    id: number;
    title: string;
    content: string;
    html_content: string;
    exposure_type: string;
    board_ids: string;
    expire_date: string | null;
    file_urls: Array<{
      originalName: string;
      filename: string;
      path: string;
      size: number;
      type: string;
    }>;
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
          html_content,
          exposure_type,
          board_ids,
          expire_date,
          file_urls,
          created_at,
          updated_at
        FROM notices
        WHERE id = ?
      `, [id]);

      if (results.length === 0) {
        throw createError({
          statusCode: 404,
          message: '공지사항을 찾을 수 없습니다.',
        });
      }

      const notice = results[0];
      
      // file_urls와 board_ids를 JSON으로 파싱
      try {
        notice.file_urls = typeof notice.file_urls === 'string' 
          ? JSON.parse(notice.file_urls) 
          : (notice.file_urls || []);
        
        notice.board_ids = typeof notice.board_ids === 'string'
          ? JSON.parse(notice.board_ids)
          : (notice.board_ids || []);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        notice.file_urls = [];
        notice.board_ids = [];
      }

      return { 
        success: true, 
        data: notice
      };
    } catch (error) {
      console.error('Error fetching notice:', error);
      throw createError({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }

  // POST 요청 처리 (등록)
  if (event.method === 'POST') {
    const body = await readBody(event);
    
    // exposure_type 검증
    const validExposureTypes = ['FIXED', 'NORMAL', 'NONE'];
    if (!validExposureTypes.includes(body.exposure_type)) {
      throw createError({
        statusCode: 400,
        message: '잘못된 노출 타입입니다.',
      });
    }

    try {
      // board_ids를 JSON 문자열로 변환
      const boardIds = Array.isArray(body.board_ids) ? JSON.stringify(body.board_ids) : '[]';

      const [result] = await pool.execute<ResultSetHeader>(`
        INSERT INTO notices (
          title, content, html_content, exposure_type, 
          board_ids, expire_date, file_urls, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        body.title || '',
        body.content || '',
        body.html_content || '',
        body.exposure_type || 'NORMAL',
        boardIds,  // JSON 문자열로 저장
        body.expire_date || null,
        JSON.stringify(body.file_urls || [])
      ]);

      return { 
        success: true, 
        message: '공지사항이 등록되었습니다.',
        data: { id: result.insertId }
      };
    } catch (error) {
      console.error('Error creating notice:', error);
      throw createError({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }

  // PUT 요청 처리 (수정)
  if (event.method === 'PUT') {
    const body = await readBody(event);

    // exposure_type 검증
    const validExposureTypes = ['FIXED', 'NORMAL', 'NONE'];
    if (!validExposureTypes.includes(body.exposure_type)) {
      throw createError({
        statusCode: 400,
        message: '잘못된 노출 타입입니다.',
      });
    }

    try {
      // board_ids를 JSON 문자열로 변환
      const boardIds = Array.isArray(body.board_ids) ? JSON.stringify(body.board_ids) : '[]';

      const [result] = await pool.execute<ResultSetHeader>(`
        UPDATE notices 
        SET 
          title = ?,
          content = ?,
          html_content = ?,
          exposure_type = ?,
          board_ids = ?,
          expire_date = ?,
          file_urls = ?,
          updated_at = NOW()
        WHERE id = ?
      `, [
        body.title || '',
        body.content || '',
        body.html_content || '',
        body.exposure_type || 'NORMAL',
        boardIds,  // JSON 문자열로 저장
        body.expire_date || null,
        JSON.stringify(body.file_urls || []),
        id
      ]);

      if (result.affectedRows === 0) {
        throw createError({
          statusCode: 404,
          message: '공지사항을 찾을 수 없습니다.',
        });
      }

      return { 
        success: true, 
        message: '공지사항이 수정되었습니다.' 
      };
    } catch (error) {
      console.error('Error updating notice:', error);
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
        message: '공지사항 ID가 필요합니다.',
      });
    }

    try {
      const [result] = await pool.execute<ResultSetHeader>(`
        DELETE FROM notices 
        WHERE id = ?
      `, [id]);

      if (result.affectedRows === 0) {
        throw createError({
          statusCode: 404,
          message: '공지사항을 찾을 수 없습니다.',
        });
      }

      return { 
        success: true, 
        message: '공지사항이 삭제되었습니다.' 
      };
    } catch (error) {
      console.error('Error deleting notice:', error);
      throw createError({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }
}); 