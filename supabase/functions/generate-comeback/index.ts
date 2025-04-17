
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.20.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    // Get request body
    const { opponentRoast, maxTokens = 150, temperature = 0.8 } = await req.json();

    // Validate input
    if (!opponentRoast || typeof opponentRoast !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid input. opponentRoast is required and must be a string." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Limit input size to prevent token abuse
    const trimmedRoast = opponentRoast.substring(0, 500);

    // Generate comedy comeback response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use GPT-4o mini for efficiency
      messages: [
        {
          role: "system",
          content: 
            "You are a witty roast battle assistant. Your job is to help the user respond to a roast with an even better comeback. " +
            "Create funny, clever responses that are edgy but not mean-spirited or offensive. " +
            "Focus on wordplay, clever twists, and humorous exaggerations. " +
            "Keep it under 100 words. Make it punchy and memorable."
        },
        {
          role: "user",
          content: `Someone roasted me with this: "${trimmedRoast}". Help me with a funny comeback that will make everyone laugh.`
        }
      ],
      max_tokens: maxTokens,
      temperature: temperature,
    });

    // Return the AI-generated comeback
    return new Response(
      JSON.stringify({
        comeback: completion.choices[0].message.content.trim(),
        usage: completion.usage,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Handle errors
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`Error generating comeback: ${errorMessage}`);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
