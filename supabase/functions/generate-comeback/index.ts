
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('Missing OpenAI API key');
    }

    const requestData = await req.json();
    const { opponentRoast, contextPrompt, maxTokens = 150, temperature = 0.8 } = requestData;

    if (!opponentRoast) {
      return new Response(
        JSON.stringify({ error: 'Missing opponent roast content' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Rate limiting - simple implementation
    // In production, use Redis or a similar service for proper rate limiting
    
    // Limit roast length to prevent excessive token usage
    const limitedRoast = opponentRoast.length > 500 
      ? opponentRoast.substring(0, 500) + "..." 
      : opponentRoast;

    const prompt = contextPrompt || 
      "You are an expert roast battle competitor. Generate a witty, clever comeback to the following roast. Make it funny, creative, and appropriate for a friendly roast battle. Don't be too mean or cross the line, but make it sharp and clever.";

    console.log("Generating comeback for roast:", limitedRoast);
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: prompt
          },
          {
            role: "user",
            content: `Generate a comeback to this roast: "${limitedRoast}"`
          }
        ],
        max_tokens: maxTokens,
        temperature: temperature
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      throw new Error(data.error.message);
    }

    const comeback = data.choices[0].message.content.trim();
    
    console.log("Generated comeback:", comeback);

    // Add to cache if implementing caching
    
    return new Response(
      JSON.stringify({ comeback }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error) {
    console.error("Error generating comeback:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
});
