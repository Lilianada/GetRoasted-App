
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { BattleReaction } from '@/types/battle';

interface ReactionCountMap {
  [key: string]: number;
}

interface SpectatorReactionsProps {
  battleId: string;
  className?: string;
}

/**
 * SpectatorReactions component for adding emoji reactions to a battle.
 */
const SpectatorReactions = ({ battleId, className = '' }: SpectatorReactionsProps) => {
  const [reactionCounts, setReactionCounts] = useState<ReactionCountMap>({
    '🔥': 0,
    '😂': 0,
    '👍': 0,
    '👎': 0,
    '❤️': 0,
    '⚡': 0
  });
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();

  // Load existing reactions
  useEffect(() => {
    if (!battleId) return;

    const fetchReactions = async () => {
      try {
        const { data, error } = await supabase
          .from('battle_reactions')
          .select('*')
          .eq('battle_id', battleId);

        if (error) throw error;

        // Count reactions by emoji
        const counts: ReactionCountMap = { '🔥': 0, '😂': 0, '👍': 0, '👎': 0, '❤️': 0, '⚡': 0 };
        const userReactionsSet = new Set<string>();
        
        // Process reaction data
        if (data) {
          data.forEach((reaction: BattleReaction) => {
            if (counts[reaction.reaction] !== undefined) {
              counts[reaction.reaction]++;
            }
            
            // Track user's reactions
            if (user && reaction.user_id === user.id) {
              userReactionsSet.add(reaction.reaction);
            }
          });
        }
        
        setReactionCounts(counts);
        setUserReactions(userReactionsSet);
      } catch (error) {
        console.error('Error fetching reactions:', error);
        toast.error('Failed to load reactions');
      }
    };

    fetchReactions();

    // Subscribe to reaction changes
    const channel = supabase
      .channel(`reactions-${battleId}`)
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'battle_reactions', filter: `battle_id=eq.${battleId}` },
          (payload) => fetchReactions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [battleId, user]);

  // Handle reaction click
  const handleReaction = async (reaction: string) => {
    if (!user) {
      toast.error('You need to log in to react');
      return;
    }

    setLoading(true);
    try {
      // Check if user already reacted with this emoji
      if (userReactions.has(reaction)) {
        // Remove the reaction
        const { data: existingReaction } = await supabase
          .from('battle_reactions')
          .select('id')
          .eq('battle_id', battleId)
          .eq('user_id', user.id)
          .eq('reaction', reaction)
          .single();

        if (existingReaction) {
          const { error: deleteError } = await supabase
            .from('battle_reactions')
            .delete()
            .eq('id', existingReaction.id);

          if (deleteError) throw deleteError;
          
          // Update local state
          setUserReactions(prev => {
            const updated = new Set(prev);
            updated.delete(reaction);
            return updated;
          });
        }
      } else {
        // Add new reaction
        const { error: insertError } = await supabase
          .from('battle_reactions')
          .insert({
            battle_id: battleId,
            user_id: user.id,
            reaction: reaction
          });

        if (insertError) throw insertError;
        
        // Update local state
        setUserReactions(prev => {
          const updated = new Set(prev);
          updated.add(reaction);
          return updated;
        });
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast.error('Failed to update reaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {Object.entries(reactionCounts).map(([emoji, count]) => (
        <Button
          key={emoji}
          variant={userReactions.has(emoji) ? "default" : "outline"}
          size="sm"
          className="relative"
          disabled={loading}
          onClick={() => handleReaction(emoji)}
        >
          <span>{emoji}</span>
          {count > 0 && (
            <span className="ml-1 text-xs font-medium">
              {count}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default SpectatorReactions;
