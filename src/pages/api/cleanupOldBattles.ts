
import { cleanupOldBattles } from '@/utils/cleanupOldBattles';

// Define appropriate request and response types without relying on Next.js
interface Request {
  method: string;
  headers: HeadersInit;
  body?: any;
}

interface Response {
  status: (code: number) => {
    json: (data: any) => Response;
  };
}

export default async function handler(req: Request, res: Response) {
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
