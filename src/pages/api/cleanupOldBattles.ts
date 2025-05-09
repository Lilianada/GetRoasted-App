
import { supabase } from '@/integrations/supabase/client';

// This API route will be called by the cron job
export default async function cleanupOldBattlesHandler(req: any, res: any) {
  if (req.method !== 'POST') {
    return { status: 405, body: { error: 'Method not allowed' } };
  }

  try {
    // Call the Supabase Edge Function directly
    const { data, error } = await supabase.functions.invoke('cleanup-expired-battles');
    
    if (error) {
      console.error('Error calling cleanupOldBattles edge function:', error);
      return { status: 500, body: { error: error.message || 'Unknown error during cleanup' } };
    }

    return { status: 200, body: data };
  } catch (error: any) {
    console.error('Exception during cleanupOldBattles:', error);
    return { status: 500, body: { error: error.message || 'Unknown error' } };
  }
}
