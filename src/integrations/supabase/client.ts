
import { createClient } from '@supabase/supabase-js';
import type { ExtendedDatabase } from '@/types/database-extension';

const SUPABASE_URL = "https://ziocbfqhcqlmovvulxmr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppb2NiZnFoY3FsbW92dnVseG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDk0OTIsImV4cCI6MjA2MDMyNTQ5Mn0.pnmv0-XEuqPL7lnkqBs6rZABOxXi05cObauW94GQAVo";

export const supabase = createClient<ExtendedDatabase>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
