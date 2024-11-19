import { db } from '~/server/db';

export async function getBotList() {
  const query = 'SELECT name, status, location, bot_id FROM bot_info';
  const [rows] = await db.execute(query);
  return rows;
} 