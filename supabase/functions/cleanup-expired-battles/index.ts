
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Starting battle cleanup process");
    
    // Get battles older than 24 hours
    const { data: expiredBattles, error: findError } = await supabaseClient
      .from('battles')
      .select('id')
      .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
    if (findError) throw findError;
    
    if (!expiredBattles || expiredBattles.length === 0) {
      console.log("No expired battles found");
      return new Response(
        JSON.stringify({ success: true, message: "No expired battles found" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const battleIds = expiredBattles.map(b => b.id);
    console.log(`Found ${battleIds.length} expired battles to delete`);
    
    // Delete the battles (RLS cascade will handle related records)
    const { error: deleteError } = await supabaseClient
      .from('battles')
      .delete()
      .in('id', battleIds);
    
    if (deleteError) throw deleteError;
    
    console.log(`Successfully deleted ${battleIds.length} expired battles`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully deleted ${battleIds.length} expired battles` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } 
  catch (error) {
    console.error("Error during battle cleanup:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
};

serve(handler);
