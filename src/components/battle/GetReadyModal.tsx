
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

interface GetReadyModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  battleId: string;
  participantCount: number;
  onBothPlayersReady?: () => void;
  countdown?: number;
}

const GetReadyModal = ({ 
  open, 
  onOpenChange, 
  battleId, 
  participantCount, 
  onBothPlayersReady,
  countdown
}: GetReadyModalProps) => {
  const [startInput, setStartInput] = useState('');
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [allPlayersReady, setAllPlayersReady] = useState(false);
  const [readyPlayerIds, setReadyPlayerIds] = useState<string[]>([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!open || !battleId || !user?.id) return;

    // Set up listener for player ready status
    const channel = supabase
      .channel(`battle-ready-${battleId}`)
      .on('broadcast', { event: 'player-ready' }, (payload) => {
        const { userId } = payload.payload;
        
        setReadyPlayerIds(prev => {
          if (!prev.includes(userId)) {
            const newReadyPlayers = [...prev, userId];
            // Check if all players are ready
            if (newReadyPlayers.length >= participantCount && participantCount >= 2) {
              setAllPlayersReady(true);
              if (onBothPlayersReady) {
                onBothPlayersReady();
              }
            }
            return newReadyPlayers;
          }
          return prev;
        });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, battleId, user?.id, participantCount, onBothPlayersReady]);

  const handleConfirm = async () => {
    if (startInput.toLowerCase() !== 'start') {
      toast.error('Please type "Start" to confirm');
      return;
    }
    
    if (!user?.id || !battleId) return;
    
    try {
      setHasConfirmed(true);
      
      // Broadcast that this player is ready
      const channel = supabase.channel(`battle-ready-${battleId}`);
      await channel.send({
        type: 'broadcast',
        event: 'player-ready',
        payload: { userId: user.id }
      });
      
      // Update the player_ready_status in the battles table
      const { data: battleData, error: getBattleError } = await supabase
        .from('battles')
        .select('player_ready_status')
        .eq('id', battleId)
        .single();
      
      if (!getBattleError && battleData) {
        const updatedStatus = { 
          ...battleData.player_ready_status,
          [user.id]: true 
        };
        
        await supabase
          .from('battles')
          .update({ player_ready_status: updatedStatus })
          .eq('id', battleId);
      }
      
      toast.success('You are ready for battle!');
    } catch (error) {
      console.error('Error confirming ready status:', error);
      toast.error('Failed to confirm ready status');
      setHasConfirmed(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={undefined}>
      <DialogContent className="bg-night-800 border-flame-500 max-w-md text-center p-8">
        <DialogTitle className="text-3xl font-bold text-flame-500">Get Ready!</DialogTitle>
        <DialogDescription className="text-white">
          Your battle is about to begin
          {countdown !== undefined && (
            <div className="text-4xl font-bold mt-2">{countdown}</div>
          )}
        </DialogDescription>
        
        <div className="flex flex-col items-center justify-center gap-6 py-6">
          {!hasConfirmed ? (
            <div className="w-full space-y-4">
              <p className="text-white">Type "Start" to confirm you're ready</p>
              <Input
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
                placeholder="Type Start..."
                className="bg-night-700 text-white border-flame-500 text-center"
                autoFocus
              />
              <Button 
                onClick={handleConfirm} 
                className="w-full bg-flame-500 hover:bg-flame-600"
                disabled={startInput.toLowerCase() !== 'start'}
              >
                Confirm
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-green-500 text-xl font-bold">You are ready!</div>
              <p className="text-white">
                {allPlayersReady ? 
                  'All players are ready. Starting battle...' : 
                  'Waiting for other player to confirm...'}
              </p>
              
              <div className="flex justify-center space-x-2 mt-2">
                <div className="w-3 h-3 rounded-full bg-flame-500 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-flame-500 animate-pulse delay-150" />
                <div className="w-3 h-3 rounded-full bg-flame-500 animate-pulse delay-300" />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GetReadyModal;
