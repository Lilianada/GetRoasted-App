
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    metadata: {
      user_id: string;
      plan: string;
    };
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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    // Create Supabase admin client to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { reference } = await req.json();
    
    if (!reference) {
      return new Response(
        JSON.stringify({ error: 'Missing transaction reference' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Verify payment with Paystack
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`
      }
    });

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      throw new Error(`Paystack verification error: ${errorData.message || 'Unknown error'}`);
    }

    const verifyData: PaystackVerifyResponse = await verifyResponse.json();
    
    // Check if payment was successful
    const isSuccessful = verifyData.status && verifyData.data.status === 'success';

    if (isSuccessful) {
      const userId = verifyData.data.metadata?.user_id;
      const plan = verifyData.data.metadata?.plan;
      
      if (!userId || !plan) {
        throw new Error('Missing user ID or plan in transaction metadata');
      }

      // Calculate subscription expiry date (30 days from now for pro plan)
      const expiresAt = plan === 'pro' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() 
        : null;

      // Update transaction status
      const { error: txError } = await supabase
        .from('payment_transactions')
        .update({ status: 'completed' })
        .eq('reference', reference);

      if (txError) {
        console.error('Failed to update transaction status:', txError);
      }

      // Update user's subscription
      const { error: subError } = await supabase
        .from('profiles')
        .update({
          subscription_tier: plan,
          subscription_expires_at: expiresAt,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (subError) {
        console.error('Failed to update subscription:', subError);
        throw new Error('Failed to update subscription');
      }
    }

    return new Response(
      JSON.stringify({ 
        success: isSuccessful,
        data: {
          status: verifyData.data.status,
          reference: verifyData.data.reference
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('Payment verification error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
