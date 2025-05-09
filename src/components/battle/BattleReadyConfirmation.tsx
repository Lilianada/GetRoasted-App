import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

interface BattleReadyConfirmationProps {
  battleId: string;
  participantCount: number;
  onBothPlayersReady?: () => void;
}

const BattleReadyConfirmation = ({ 
  battleId,
  participantCount,
  onBothPlayersReady
}: BattleReadyConfirmationProps) => {
  const { user } = useAuthContext();
  const [confirmText, setConfirmText] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [otherPlayerReady, setOtherPlayerReady] = useState(false);
  const [readyStatus, setReadyStatus] = useState<Record<string, boolean>>({});
  
  // Subscribe to battle ready status changes
  useEffect(() => {
    if (!battleId || !user) return;
    
    // First, get the current ready status
    const fetchReadyStatus = async () => {
      const { data } = await supabase
        .from('battles')
        .select('player_ready_status')
        .eq('id', battleId)
        .single();
        
      if (data?.player_ready_status) {
        const status = data.player_ready_status as Record<string, boolean>;
        setReadyStatus(status);
        
        // Check if current user is ready
        if (status[user.id]) {
          setIsReady(true);
        }
        
        // Check if any other player is ready
        const otherReady = Object.entries(status)
          .some(([userId, ready]) => userId !== user.id && ready);
          
        setOtherPlayerReady(otherReady);
      }
    };
    
    fetchReadyStatus();
    
    // Subscribe to changes
    const channel = supabase
      .channel(`battle-ready-${battleId}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'battles', filter: `id=eq.${battleId}` }, 
        (payload) => {
          if (payload.new && payload.new.player_ready_status) {
            const status = payload.new.player_ready_status as Record<string, boolean>;
            setReadyStatus(status);
            
            // Check if any other player is ready
            const otherReady = Object.entries(status)
              .some(([userId, ready]) => userId !== user.id && ready);
              
            setOtherPlayerReady(otherReady);
            
            // Check if all participants are ready
            const allReady = Object.values(status).every(ready => ready);
            const participantsReady = Object.keys(status).length;
            
            if (allReady && participantsReady >= 2 && onBothPlayersReady) {
              onBothPlayersReady();
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [battleId, user, onBothPlayersReady]);
  
  const handleConfirm = async () => {
    if (!battleId || !user || isReady) return;
    
    if (confirmText.toLowerCase() !== 'start') {
      toast.error('Please type "Start" to confirm');
      return;
    }
    
    try {
      // Update the player ready status
      const { data, error } = await supabase
        .from('battles')
        .select('player_ready_status')
        .eq('id', battleId)
        .single();
        
      if (error) throw error;
      
      const existingStatus = data?.player_ready_status || {};
      const updatedStatus = {
        ...existingStatus,
        [user.id]: true
      };
      
      const { error: updateError } = await supabase
        .from('battles')
        .update({ player_ready_status: updatedStatus })
        .eq('id', battleId);
        
      if (updateError) throw updateError;
      
      setIsReady(true);
      toast.success("You're ready! Waiting for your opponent...");
      
    } catch (error) {
      console.error('Error marking player as ready:', error);
      toast.error("Failed to confirm ready status");
    }
  };
  
  // If participant count is less than 2, show waiting message
  if (participantCount < 2) {
    return (
      <div className="bg-secondary/20 p-4 rounded text-center">
        <p className="text-muted-foreground">Waiting for opponent to join...</p>
        <p className="text-sm text-muted-foreground mt-2">Share your battle code with them</p>
      </div>
    );
  }
  
  // If the player is already ready, show status
  if (isReady) {
    return (
      <div className="bg-secondary/20 p-4 rounded text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <p className="font-medium">You're ready!</p>
        </div>
        
        {otherPlayerReady ? (
          <p className="text-green-500 font-medium">Both players ready! Starting battle...</p>
        ) : (
          <p className="text-sm text-muted-foreground">Waiting for opponent to confirm...</p>
        )}
      </div>
    );
  }
  
  // Otherwise, show the confirmation form
  return (
    <div className="bg-secondary/20 p-4 rounded">
      <div className="text-center mb-3">
        <p className="font-medium">Both players must confirm to start</p>
        {otherPlayerReady && (
          <p className="text-sm text-green-500 mt-1">Your opponent is ready!</p>
        )}
      </div>
      
      <div className="flex gap-2">
        <Input 
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder='Type "Start" to confirm'
          className="flex-1"
        />
        
        <Button 
          onClick={handleConfirm}
          disabled={confirmText.toLowerCase() !== 'start'}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default BattleReadyConfirmation;
