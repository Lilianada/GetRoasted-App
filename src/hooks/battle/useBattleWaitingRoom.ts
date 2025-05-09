
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

export function useBattleWaitingRoom(battleId: string | undefined) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [battleData, setBattleData] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGetReadyModal, setShowGetReadyModal] = useState(false);
  const [battleState, setBattleState] = useState<'waiting' | 'ready' | 'active' | 'completed'>('waiting');
  const [countdown, setCountdown] = useState(3);
  const [spectatorCount, setSpectatorCount] = useState(0);
  const [bothPlayersReady, setBothPlayersReady] = useState(false);
  
  // Fetch initial battle data and set up subscriptions
  useEffect(() => {
    if (!battleId) {
      setLoading(false);
      return;
    }
    
    const fetchBattleData = async () => {
      try {
        // Fetch battle data
        const { data: battle, error: battleError } = await supabase
          .from('battles')
          .select('*')
          .eq('id', battleId)
          .single();
          
        if (battleError) {
          console.error('Error fetching battle data:', battleError);
          toast.error("Failed to load battle information");
          setLoading(false);
          return;
        }
        
        setBattleData(battle);
        
        // If the battle is already active, prepare to redirect
        if (battle.status === 'active') {
          setBattleState('active');
        }
        
        try {
          // Fetch initial participants
          const { data: participantsData, error: participantsError } = await supabase
            .from('battle_participants')
            .select('*, profiles:user_id(*)')
            .eq('battle_id', battleId);
            
          if (participantsError) {
            console.error('Error fetching participants:', participantsError);
            // Continue execution even if participants fetch fails
          } else {
            setParticipants(participantsData || []);
            
            // If there are already 2 participants, show the ready modal
            if (participantsData && participantsData.length >= 2) {
              setShowGetReadyModal(true);
            }
          }
        } catch (err) {
          console.error('Error in participants fetch:', err);
          // Continue execution even if participants fetch fails
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in battle data fetch:', error);
        toast.error("Failed to load battle information");
        setLoading(false);
      }
    };
    
    fetchBattleData();
    
    // Set up real-time subscription for participants
    const participantsChannel = supabase
      .channel(`battle_participants_${battleId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battle_participants', filter: `battle_id=eq.${battleId}` }, 
        async () => {
          try {
            // Refresh participants list
            const { data: newParticipantsData, error: participantsError } = await supabase
              .from('battle_participants')
              .select('*, profiles:user_id(*)')
              .eq('battle_id', battleId);
              
            if (participantsError) {
              console.error('Error refreshing participants:', participantsError);
              return;
            }
            
            if (newParticipantsData) {
              setParticipants(newParticipantsData);
              
              // If a second participant has joined, show the ready modal
              if (newParticipantsData.length >= 2 && !showGetReadyModal) {
                setShowGetReadyModal(true);
              }
            }
          } catch (err) {
            console.error('Error in participants refresh:', err);
          }
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to participants channel:', status);
        }
      });
      
    // Listen for battle status changes
    const battleChannel = supabase
      .channel(`battle_status_${battleId}`)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'battles', filter: `id=eq.${battleId}` },
        (payload) => {
          try {
            const updatedBattle = payload.new as any;
            setBattleData(updatedBattle);
            
            if (updatedBattle.status === 'active') {
              setBattleState('active');
              // Don't navigate immediately - let the countdown handle it
              if (!showGetReadyModal) {
                setShowGetReadyModal(true);
              }
            }
          } catch (err) {
            console.error('Error processing battle update:', err);
          }
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to battle status channel:', status);
        }
      });
      
    return () => {
      // Clean up subscriptions
      supabase.removeChannel(participantsChannel);
      supabase.removeChannel(battleChannel);
    };
  }, [battleId, navigate, showGetReadyModal]);
  
  // Handle countdown effect for the Get Ready modal
  useEffect(() => {
    if (!bothPlayersReady || !showGetReadyModal) {
      setCountdown(3);
      return;
    }
    
    if (countdown <= 0) {
      setShowGetReadyModal(false);
      handleEnterBattleRoom();
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [bothPlayersReady, showGetReadyModal, countdown]);
  
  const handleInviteContacts = () => {
    if (!battleData?.invite_code) return;
    
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: 'Join my Roast Battle!',
          text: `Enter code ${battleData.invite_code} to join my battle!`,
          url: window.location.href,
        }).catch(err => {
          console.log('Error sharing:', err);
        });
      } else {
        toast.info(`Share this code with your opponent: ${battleData.invite_code}`);
      }
    }
  };
  
  const handleEnterBattleRoom = () => {
    if (!battleId) return;
    
    navigate(`/battles/live/${battleId}`);
  };
  
  const handleBattleStateChange = (newState: 'waiting' | 'ready' | 'active' | 'completed') => {
    setBattleState(newState);
    
    // If battle is now active and wasn't before, show notification
    if (newState === 'active' && battleState !== 'active') {
      toast.success("Battle is now active! You can enter the battle room.");
    }
  };
  
  const handleBothPlayersReady = async () => {
    if (!battleId) return;
    
    // Set ready flag to start countdown
    setBothPlayersReady(true);
    
    try {
      // Update battle status to active
      await supabase
        .from('battles')
        .update({ status: 'active' })
        .eq('id', battleId);
        
      toast.success("Both players are ready! Battle is starting...");
    } catch (err) {
      console.error('Error updating battle status:', err);
      toast.error("Failed to start the battle");
    }
  };

  return {
    battleData,
    participants,
    loading,
    showGetReadyModal,
    battleState,
    countdown,
    spectatorCount,
    setShowGetReadyModal,
    setSpectatorCount,
    handleInviteContacts,
    handleEnterBattleRoom,
    handleBattleStateChange,
    handleBothPlayersReady
  };
}
