
import { supabase } from "@/integrations/supabase/client";

export async function generateComeback(opponentRoast: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-comeback', {
      body: { opponentRoast }
    });

    if (error) throw error;
    return data.comeback;
  } catch (error) {
    console.error('Error generating comeback:', error);
    return 'Unable to generate a comeback at this time. Try your own creativity!';
  }
}
