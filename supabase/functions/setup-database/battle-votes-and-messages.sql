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

CREATE POLICY "Users can insert their own votes"
  ON public.battle_votes
  FOR INSERT
  WITH CHECK (auth.uid() = voter_id);

CREATE POLICY "Users can select their own votes"
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

CREATE POLICY "Users can insert their own messages"
  ON public.battle_messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can select messages from battles they participate in"
  ON public.battle_messages
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.battle_participants bp
    WHERE bp.battle_id = battle_id AND bp.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.battle_spectators bs
    WHERE bs.battle_id = battle_id AND bs.user_id = auth.uid()
  ));
