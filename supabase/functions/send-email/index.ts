
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type EmailRequest = {
  email: string;
  name: string;
  templateId: string;
  subject: string;
  data: {
    [key: string]: string;
  };
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Get request body
    const requestBody = await req.json() as EmailRequest;
    const { email, name, templateId, subject, data } = requestBody;

    if (!email || !templateId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Initialize SendPulse with environment variables from Supabase Secrets
    const SENDPULSE_USER_ID = Deno.env.get("SENDPULSE_USER_ID");
    const SENDPULSE_SECRET = Deno.env.get("SENDPULSE_SECRET");
    
    if (!SENDPULSE_USER_ID || !SENDPULSE_SECRET) {
      return new Response(
        JSON.stringify({ error: "SendPulse credentials not configured" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Initialize Supabase client to update notification status
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    
    const supabase = createClient(supabaseUrl, supabaseServiceRole);

    // Here we would communicate with SendPulse API
    // For now we'll simulate a successful email sending

    // Record the email sending attempt in a new table if desired
    await supabase.from("email_logs").insert({
      recipient_email: email,
      template_id: templateId,
      status: "success",
      sent_at: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email scheduled for delivery",
        recipientEmail: email,
        templateId: templateId
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (err) {
    console.error("Unexpected error sending email:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred", details: err.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
