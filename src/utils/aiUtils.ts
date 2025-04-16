
import { supabase } from "@/integrations/supabase/client";

export async function generateComeback(opponentRoast: string): Promise<string> {
  try {
    // Add validation to prevent excessive token usage
    if (opponentRoast.length > 500) {
      opponentRoast = opponentRoast.substring(0, 500) + "...";
    }
    
    const { data, error } = await supabase.functions.invoke('generate-comeback', {
      body: { 
        opponentRoast,
        // Optional parameters for advanced usage
        maxTokens: 150,
        temperature: 0.8
      }
    });

    if (error) throw error;
    return data.comeback;
  } catch (error) {
    console.error('Error generating comeback:', error);
    return 'Unable to generate a comeback at this time. Try your own creativity!';
  }
}

// Add caching to reduce API usage
const comebackCache = new Map<string, {comeback: string, timestamp: number}>();
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export async function generateComebackWithCache(opponentRoast: string): Promise<string> {
  // Create a simple key for the cache
  const cacheKey = opponentRoast.toLowerCase().trim();
  
  // Check if we have a cached response
  const cached = comebackCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return cached.comeback;
  }
  
  // Generate new comeback
  const comeback = await generateComeback(opponentRoast);
  
  // Cache the result
  comebackCache.set(cacheKey, {
    comeback,
    timestamp: Date.now()
  });
  
  return comeback;
}
