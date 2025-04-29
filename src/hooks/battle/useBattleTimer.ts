
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface UseBattleTimerProps {
  battleId: string | undefined;
  timePerTurn: number;
  onTimeEnd?: () => void;
}

/**
 * Hook to manage battle timer
 */
export function useBattleTimer({
  battleId,
  timePerTurn,
  onTimeEnd
}: UseBattleTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(timePerTurn);
  
  // Format time for display
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }, []);
  
  // Calculate time percentage
  const timePercentage = (timeRemaining / timePerTurn) * 100;
  
  // Update the timer
  const updateTimer = useCallback((newTime: number) => {
    setTimeRemaining(newTime);
    
    if (battleId) {
      // Sync timer between clients
      const channel = supabase.channel(`battle-timer-${battleId}`);
      channel.send({
        type: 'broadcast',
        event: 'timer-update',
        payload: { timeRemaining: newTime }
      });
    }
  }, [battleId]);
  
  // Reset the timer
  const resetTimer = useCallback(() => {
    updateTimer(timePerTurn);
  }, [timePerTurn, updateTimer]);
  
  // Listen for timer updates
  useEffect(() => {
    if (!battleId) return;
    
    // Subscribe to battle timer updates
    const channel = supabase
      .channel(`battle-timer-${battleId}`)
      .on('broadcast', { event: 'timer-update' }, (payload) => {
        if (payload.payload && payload.payload.timeRemaining !== undefined) {
          setTimeRemaining(payload.payload.timeRemaining);
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [battleId]);
  
  // Handle timer countdown
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        updateTimer(timeRemaining - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && onTimeEnd) {
      onTimeEnd();
    }
  }, [timeRemaining, onTimeEnd, updateTimer]);
  
  return {
    timeRemaining,
    timePercentage,
    formatTime,
    updateTimer,
    resetTimer
  };
}
