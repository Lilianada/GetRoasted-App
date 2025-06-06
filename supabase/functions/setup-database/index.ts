
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

serve(async (req) => {
  try {
    // Check if this is an authorized request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Create notifications table if it doesn't exist
    const { error: notificationsError } = await supabaseAdmin.rpc("execute_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS public.notifications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          read BOOLEAN NOT NULL DEFAULT false,
          type TEXT NOT NULL,
          action_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );

        ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view their own notifications"
          ON public.notifications
          FOR SELECT
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can update their own notifications"
          ON public.notifications
          FOR UPDATE
          USING (auth.uid() = user_id);
      `,
    });

    if (notificationsError) throw notificationsError;

    // Add time_per_turn column to battles if it doesn't exist
    const { error: battlesError } = await supabaseAdmin.rpc("execute_sql", {
      sql: `
        DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'battles' AND column_name = 'time_per_turn'
          ) THEN
            ALTER TABLE public.battles ADD COLUMN time_per_turn INTEGER NOT NULL DEFAULT 180;
          END IF;
          
          IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'battles' AND column_name = 'allow_spectators'
          ) THEN
            ALTER TABLE public.battles ADD COLUMN allow_spectators BOOLEAN NOT NULL DEFAULT true;
          END IF;
        END $$;
      `,
    });

    if (battlesError) throw battlesError;

    // Create battle_votes and battle_messages tables if they don't exist
    const { error: votesAndMessagesError } = await supabaseAdmin.rpc("execute_sql", {
      sql: `
        -- Create battle_votes table if it doesn't exist
        CREATE TABLE IF NOT EXISTS public.battle_votes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          battle_id UUID NOT NULL REFERENCES public.battles(id) ON DELETE CASCADE,
          voter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          voted_for_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          UNIQUE (battle_id, voter_id)
        );

        ALTER TABLE public.battle_votes ENABLE ROW LEVEL SECURITY;

        CREATE POLICY IF NOT EXISTS "Users can insert their own votes"
          ON public.battle_votes
          FOR INSERT
          WITH CHECK (auth.uid() = voter_id);

        CREATE POLICY IF NOT EXISTS "Users can select their own votes"
          ON public.battle_votes
          FOR SELECT
          USING (auth.uid() = voter_id);

        -- Create battle_messages table if it doesn't exist
        CREATE TABLE IF NOT EXISTS public.battle_messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          battle_id UUID NOT NULL REFERENCES public.battles(id) ON DELETE CASCADE,
          sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          message TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );

        ALTER TABLE public.battle_messages ENABLE ROW LEVEL SECURITY;

        CREATE POLICY IF NOT EXISTS "Users can insert their own messages"
          ON public.battle_messages
          FOR INSERT
          WITH CHECK (auth.uid() = sender_id);

        CREATE POLICY IF NOT EXISTS "Users can select messages from battles they participate in"
          ON public.battle_messages
          FOR SELECT
          USING (EXISTS (
            SELECT 1 FROM public.battle_participants bp
            WHERE bp.battle_id = battle_id AND bp.user_id = auth.uid()
          ) OR EXISTS (
            SELECT 1 FROM public.battle_spectators bs
            WHERE bs.battle_id = battle_id AND bs.user_id = auth.uid()
          ));
      `,
    });

    if (votesAndMessagesError) throw votesAndMessagesError;

    // Update battle_participants and battle_spectators
    const { error: participantsError } = await supabaseAdmin.rpc("execute_sql", {
      sql: `
        ALTER TABLE IF EXISTS public.battle_participants 
        ADD COLUMN IF NOT EXISTS joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

        ALTER TABLE IF EXISTS public.battle_spectators 
        ADD COLUMN IF NOT EXISTS joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
      `,
    });

    if (participantsError) throw participantsError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
