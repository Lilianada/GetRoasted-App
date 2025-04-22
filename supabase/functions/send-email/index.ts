
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.5";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type EmailRequest = {
  email: string;
  name: string;
  subject: string;
  message: string;
  actionUrl?: string;
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Get request body
    const requestBody = await req.json() as EmailRequest;
    const { email, name, subject, message, actionUrl } = requestBody;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Initialize Resend with API key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "Resend API key not configured" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    const resend = new Resend(resendApiKey);

    // Build email HTML
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">${subject}</h1>
        <p>Hello ${name},</p>
        <p>${message || 'You have a new notification from GetRoastedOnline.'}</p>
        ${actionUrl ? `<p><a href="${actionUrl}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">View Details</a></p>` : ''}
        <p>Best regards,<br>The GetRoastedOnline Team</p>
      </div>
    `;
    
    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "GetRoastedOnline <notifications@getroastedonline.com>",
      to: [email],
      subject: subject,
      html: htmlContent
    });

    console.log("Email response:", emailResponse);
    
    // Initialize Supabase client to log the email attempt
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    
    const supabase = createClient(supabaseUrl, supabaseServiceRole);

    // Record the email sending attempt in a logs table
    await supabase.from("email_logs").insert({
      recipient_email: email,
      subject: subject,
      status: "success", 
      sent_at: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        recipientEmail: email
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
