import type { NextApiRequest, NextApiResponse } from 'next';
import { cleanupOldBattles } from '@/utils/cleanupOldBattles';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const deletedIds = await cleanupOldBattles();
    res.status(200).json({ deleted: deletedIds, message: `${deletedIds.length} old battles deleted.` });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
}
