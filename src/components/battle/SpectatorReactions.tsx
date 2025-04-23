
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Flame, ThumbsUp, ThumbsDown, Heart, Laugh, Zap } from "lucide-react";
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

  // Load existing reactions when component mounts
  useEffect(() => {
    const loadReactions = async () => {
      try {
        const { data, error } = await supabase
          .from('battle_reactions')
          .select('reaction')
          .eq('battle_id', battleId)
          .eq('roast_id', roastId || null);

        if (error) throw error;

        // Count reactions
        const counts = { ...reactionCounts };
        if (data) {
          data.forEach(item => {
            if (counts[item.reaction] !== undefined) {
              counts[item.reaction] += 1;
            }
          });
          setReactionCounts(counts);
        }

        // Check if user already reacted
        if (user) {
          const { data: userReaction } = await supabase
            .from('battle_reactions')
            .select('reaction')
            .eq('battle_id', battleId)
            .eq('roast_id', roastId || null)
            .eq('user_id', user.id)
            .single();

          if (userReaction) {
            setSelectedReaction(userReaction.reaction);
          }
        }
      } catch (error) {
        console.error("Error loading reactions:", error);
      }
    };

    if (battleId) {
      loadReactions();
    }
  }, [battleId, roastId, user]);

  // Subscribe to reaction updates
  useEffect(() => {
    if (!battleId) return;

    const channel = supabase.channel(`battle-reactions-${battleId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'battle_reactions',
        filter: `battle_id=eq.${battleId}` 
      }, payload => {
        if (payload.new && payload.new.reaction) {
          const reaction = payload.new.reaction as string;
          setReactionCounts(prev => ({
            ...prev,
            [reaction]: (prev[reaction] || 0) + 1
          }));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [battleId]);

  const handleReaction = async (emoji: string) => {
    if (!user) {
      toast.error("You need to be logged in to react");
      return;
    }

    try {
      setIsSubmitting(true);

      // Check if user already reacted
      if (selectedReaction) {
        // Remove previous reaction count
        setReactionCounts(prev => ({
          ...prev,
          [selectedReaction]: Math.max(0, prev[selectedReaction] - 1)
        }));

        // Delete previous reaction
        await supabase
          .from('battle_reactions')
          .delete()
          .eq('battle_id', battleId)
          .eq('roast_id', roastId || null)
          .eq('user_id', user.id);
      }

      // Optimistically update UI if selecting a new reaction
      if (selectedReaction !== emoji) {
        setSelectedReaction(emoji);
        setReactionCounts(prev => ({
          ...prev,
          [emoji]: prev[emoji] + 1
        }));

        // Send reaction to database
        const { error } = await supabase
          .from('battle_reactions')
          .insert({
            battle_id: battleId,
            roast_id: roastId || null,
            user_id: user.id,
            reaction: emoji
          });

        if (error) throw error;
      } else {
        // User clicked the same reaction again, so we're removing it
        setSelectedReaction(null);
      }
    } catch (error) {
      console.error("Error sending reaction:", error);
      toast.error("Failed to send reaction");
      
      // Revert optimistic update on failure
      if (selectedReaction !== emoji) {
        setReactionCounts(prev => ({
          ...prev,
          [emoji]: Math.max(0, prev[emoji] - 1)
        }));
        
        setSelectedReaction(null);
      }
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
