
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
    
    // Get timestamp for 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    // Find unused battles - battles older than 24 hours that haven't been used
    // We define "unused" as battles with status 'waiting' (never started) or
    // battles with no participants
    const { data: oldBattles, error: findError } = await supabaseClient
      .from('battles')
      .select('id, status, created_at')
      .lt('created_at', twentyFourHoursAgo)
      .in('status', ['waiting', 'ready']);
    
    if (findError) throw findError;
    
    if (!oldBattles || oldBattles.length === 0) {
      console.log("No old unused battles found");
      return new Response(
        JSON.stringify({ success: true, message: "No old unused battles found" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // For each battle, check if it has participants
    const battleIdsToDelete = [];
    for (const battle of oldBattles) {
      const { data: participants, error: participantsError } = await supabaseClient
        .from('battle_participants')
        .select('id')
        .eq('battle_id', battle.id)
        .limit(1);
      
      if (participantsError) throw participantsError;
      
      // If there are no participants or only 1 (meaning the battle never really started)
      // mark for deletion
      if (!participants || participants.length <= 1) {
        battleIdsToDelete.push(battle.id);
      }
    }
    
    if (battleIdsToDelete.length === 0) {
      console.log("No battles qualify for deletion");
      return new Response(
        JSON.stringify({ success: true, message: "No battles qualify for deletion" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Found ${battleIdsToDelete.length} unused battles to delete`);
    
    // Delete the battles (RLS cascade will handle related records)
    const { error: deleteError } = await supabaseClient
      .from('battles')
      .delete()
      .in('id', battleIdsToDelete);
    
    if (deleteError) throw deleteError;
    
    console.log(`Successfully deleted ${battleIdsToDelete.length} old unused battles`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully deleted ${battleIdsToDelete.length} old unused battles`,
        deleted_ids: battleIdsToDelete
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
