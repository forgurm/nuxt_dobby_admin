import { defineEventHandler } from 'h3';
import { getBotList } from '~/server/db/bots';

export default defineEventHandler(async (event) => {
  try {
    const bots = await getBotList();
    return { success: true, data: bots };
  } catch (error) {
    return { success: false, message: '봇 목록을 가져오는 데 실패했습니다.' };
  }
}); 