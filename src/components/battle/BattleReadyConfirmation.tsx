
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";

interface BattleReadyConfirmationProps {
  battleId: string;
  onBothPlayersReady: () => void;
  participantCount: number;
}

const BattleReadyConfirmation = ({ 
  battleId,
  onBothPlayersReady,
  participantCount
}: BattleReadyConfirmationProps) => {
  const { user } = useAuthContext();
  const [inputValue, setInputValue] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  
  // Listen to ready status changes
  useEffect(() => {
    if (!battleId || !user) return;

    // Initial fetch of ready status
    const fetchReadyStatus = async () => {
      const { data: battle } = await supabase
        .from('battles')
        .select('player_ready_status')
        .eq('id', battleId)
        .single();
        
      if (battle?.player_ready_status) {
        try {
          const readyStatus = JSON.parse(battle.player_ready_status);
          setIsReady(!!readyStatus[user.id]);
          
          // Check if opponent is ready
          const opponentReadyStatus = Object.entries(readyStatus)
            .some(([userId, ready]) => userId !== user.id && ready === true);
            
          setOpponentReady(opponentReadyStatus);
          
          // Check if both players are ready
          if (Object.values(readyStatus).filter(Boolean).length >= 2) {
            onBothPlayersReady();
          }
        } catch (e) {
          console.error("Error parsing ready status:", e);
        }
      }
    };
    
    fetchReadyStatus();

    // Subscribe to changes
    const channel = supabase
      .channel(`battle-ready-${battleId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'battles',
        filter: `id=eq.${battleId}`
      }, async (payload) => {
        if (payload.new && payload.new.player_ready_status) {
          try {
            const readyStatus = JSON.parse(payload.new.player_ready_status);
            setIsReady(!!readyStatus[user.id]);
            
            // Check if opponent is ready
            const opponentReadyStatus = Object.entries(readyStatus)
              .some(([userId, ready]) => userId !== user.id && ready === true);
              
            setOpponentReady(opponentReadyStatus);
            
            // Check if both players are ready
            if (Object.values(readyStatus).filter(Boolean).length >= 2) {
              onBothPlayersReady();
            }
          } catch (e) {
            console.error("Error parsing ready status:", e);
          }
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [battleId, user, onBothPlayersReady]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !battleId || inputValue.toLowerCase() !== 'start') return;
    
    try {
      // Get current ready status
      const { data: battle } = await supabase
        .from('battles')
        .select('player_ready_status')
        .eq('id', battleId)
        .single();
        
      let readyStatus = {};
      if (battle?.player_ready_status) {
        try {
          readyStatus = JSON.parse(battle.player_ready_status);
        } catch (e) {
          console.error("Error parsing ready status:", e);
        }
      }
      
      // Update ready status for current user
      readyStatus = {
        ...readyStatus,
        [user.id]: true
      };
      
      // Update battle
      await supabase
        .from('battles')
        .update({
          player_ready_status: JSON.stringify(readyStatus)
        })
        .eq('id', battleId);
        
      setIsReady(true);
      
    } catch (error) {
      console.error("Error updating ready status:", error);
    }
  };
  
  const isDisabled = isReady || participantCount < 2;
  
  return (
    <div className="mt-6 p-4 border border-night-700 rounded-lg bg-night-800/50">
      <h3 className="text-lg font-medium text-center mb-4">Ready to Battle?</h3>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isReady ? 'bg-green-500' : 'bg-night-600'}`}></div>
          <span>You: {isReady ? 'Ready' : 'Not Ready'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${opponentReady ? 'bg-green-500' : 'bg-night-600'}`}></div>
          <span>Opponent: {opponentReady ? 'Ready' : 'Not Ready'}</span>
        </div>
      </div>
      
      {!isReady && (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isDisabled ? (participantCount < 2 ? 'Waiting for opponent...' : '') : 'Type "Start" to ready up'}
            className="border-night-700"
            disabled={isDisabled}
          />
          <Button 
            type="submit"
            disabled={isDisabled || inputValue.toLowerCase() !== 'start'}
            variant={inputValue.toLowerCase() === 'start' ? 'default' : 'outline'}
            className="whitespace-nowrap"
          >
            Ready Up
          </Button>
        </form>
      )}
      
      {isReady && (
        <div className="mt-4 p-2 bg-green-500/20 border border-green-500 rounded flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>You are ready! Waiting for opponent...</span>
        </div>
      )}
      
      {participantCount < 2 && (
        <div className="mt-4 p-2 bg-yellow-500/20 border border-yellow-500 rounded flex items-center gap-2 text-sm">
          <XCircle className="h-4 w-4 text-yellow-500" />
          <span>Waiting for opponent to join...</span>
        </div>
      )}
    </div>
  );
};

export default BattleReadyConfirmation;
