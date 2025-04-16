
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      throw new Error('Paystack secret key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    // Create Supabase admin client to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { email, amount, plan, userId, callback_url } = await req.json();
    
    // Validate inputs
    if (!email || !amount || !plan || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, amount, plan, and userId are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Initialize payment with Paystack
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${paystackSecretKey}`
      },
      body: JSON.stringify({
        email,
        amount, // amount in kobo (smallest currency unit)
        callback_url,
        metadata: {
          user_id: userId,
          plan,
        }
      })
    });

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json();
      throw new Error(`Paystack error: ${errorData.message || 'Unknown error'}`);
    }

    const paystackData: PaystackInitializeResponse = await paystackResponse.json();

    // Store transaction reference in database
    const { error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        reference: paystackData.data.reference,
        amount,
        plan,
        status: 'pending'
      });

    if (dbError) {
      console.error('Failed to store transaction:', dbError);
    }

    // Return the authorization URL to redirect the user
    return new Response(
      JSON.stringify({ 
        authorization_url: paystackData.data.authorization_url,
        reference: paystackData.data.reference
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('Payment initialization error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
