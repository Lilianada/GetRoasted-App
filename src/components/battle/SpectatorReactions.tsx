
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Flame, ThumbsUp, ThumbsDown, Heart, Laugh, Zap, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

const REACTIONS = [
  { emoji: '🔥', icon: Flame, label: 'Fire', color: 'text-flame-500' },
  { emoji: '😂', icon: Laugh, label: 'Funny', color: 'text-yellow-500' },
  { emoji: '👍', icon: ThumbsUp, label: 'Good', color: 'text-green-500' },
  { emoji: '👎', icon: ThumbsDown, label: 'Bad', color: 'text-red-500' },
  { emoji: '❤️', icon: Heart, label: 'Love', color: 'text-pink-500' },
  { emoji: '⚡', icon: Zap, label: 'Savage', color: 'text-purple-500' },
];

interface SpectatorReactionsProps {
  battleId: string;
  roastId?: string;
}

export default function SpectatorReactions({ battleId, roastId }: SpectatorReactionsProps) {
  const { user } = useAuthContext();
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>(
    REACTIONS.reduce((acc, reaction) => ({ ...acc, [reaction.emoji]: 0 }), {})
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReaction = async (emoji: string) => {
    if (!user) {
      toast.error("You need to be logged in to react");
      return;
    }

    try {
      setIsSubmitting(true);
      setSelectedReaction(emoji);

      // Optimistically update UI
      setReactionCounts(prev => ({
        ...prev,
        [emoji]: prev[emoji] + 1
      }));

      // Send reaction to database
      const { error } = await supabase
        .from('battle_reactions')
        .insert({
          battle_id: battleId,
          roast_id: roastId,
          user_id: user.id,
          reaction: emoji
        });

      if (error) throw error;

      // Broadcast reaction to channel
      const channel = supabase.channel(`battle-reactions-${battleId}`);
      channel.send({
        type: 'broadcast',
        event: 'reaction',
        payload: { emoji, userId: user.id }
      });

    } catch (error) {
      console.error("Error sending reaction:", error);
      toast.error("Failed to send reaction");
      
      // Revert optimistic update on failure
      setReactionCounts(prev => ({
        ...prev,
        [emoji]: prev[emoji] - 1
      }));
      
      setSelectedReaction(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-wrap gap-2">
        {REACTIONS.map((reaction) => {
          const count = reactionCounts[reaction.emoji];
          const isSelected = selectedReaction === reaction.emoji;
          
          return (
            <Button
              key={reaction.emoji}
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 py-1 px-2 ${isSelected ? 'bg-secondary border-black' : 'bg-white'}`}
              onClick={() => handleReaction(reaction.emoji)}
              disabled={isSubmitting}
            >
              <reaction.icon className={`h-3 w-3 ${reaction.color}`} />
              <span>{reaction.emoji}</span>
              {count > 0 && (
                <Badge variant="outline" className="ml-1 py-0 px-1 h-4 min-w-4 text-xs flex items-center justify-center">
                  {count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
