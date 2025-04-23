
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

serve(async (req) => {
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default when deployed to Supabase Functions
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API KEY - env var exported by default when deployed to Supabase Functions
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Delete battles older than 24 hours
    const { data, error } = await supabaseClient
      .from("battles")
      .delete()
      .lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .select();

    if (error) throw error;

    // Return the number of deleted battles
    return new Response(
      JSON.stringify({
        message: `Successfully deleted ${data?.length || 0} expired battles`,
        deleted_count: data?.length || 0,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
