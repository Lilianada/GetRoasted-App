
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useAuthContext } from "@/context/AuthContext";
import { shareWithContacts } from "@/utils/battleSharingUtils";

export const useBattleWaitingRoom = (battleId: string | undefined) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [battleData, setBattleData] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGetReadyModal, setShowGetReadyModal] = useState(false);
  const [battleState, setBattleState] = useState<'waiting' | 'ready' | 'active' | 'completed'>('waiting');
  const [countdown, setCountdown] = useState(3);
  const [spectatorCount, setSpectatorCount] = useState(0);
  const [playersReady, setPlayersReady] = useState(false);
  
  useEffect(() => {
    if (!battleId || !user) return;
    
    const fetchBattleData = async () => {
      try {
        // Fetch battle data
        const { data: battle, error: battleError } = await supabase
          .from('battles')
          .select('*')
          .eq('id', battleId)
          .single();
          
        if (battleError) throw battleError;
        
        setBattleData(battle);
        
        // Fetch initial participants
        const { data: participantsData, error: participantsError } = await supabase
          .from('battle_participants')
          .select('*, profiles:user_id(*)')
          .eq('battle_id', battleId);
          
        if (participantsError) throw participantsError;
        
        setParticipants(participantsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching battle data:', error);
        toast.error("Failed to load battle information");
        setLoading(false);
      }
    };
    
    fetchBattleData();
    
    // Set up real-time subscription for participants
    const channel = supabase
      .channel('battle_participants_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battle_participants', filter: `battle_id=eq.${battleId}` }, 
        async () => {
          // Refresh participants list
          const { data: newParticipantsData } = await supabase
            .from('battle_participants')
            .select('*, profiles:user_id(*)')
            .eq('battle_id', battleId);
            
          if (newParticipantsData) {
            setParticipants(newParticipantsData);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [battleId, user, navigate]);
  
  // Countdown effect for the Get Ready modal
  useEffect(() => {
    if (!showGetReadyModal) {
      setCountdown(3);
      return;
    }
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [showGetReadyModal, countdown]);
  
  const handleInviteContacts = () => {
    if (!battleData?.invite_code) return;
    shareWithContacts(battleData.invite_code);
  };
  
  const handleEnterBattleRoom = () => {
    if (battleData?.status === 'active' || participants.length >= 2) {
      navigate(`/battles/live/${battleId}`);
    } else {
      toast.info("The battle hasn't started yet. Waiting for opponent to join.");
    }
  };
  
  const handleBattleStateChange = (newState: 'waiting' | 'ready' | 'active' | 'completed') => {
    setBattleState(newState);
    
    // If battle is now active or ready and wasn't before, we may want to auto-redirect or show a notification
    if (newState === 'active' && battleState !== 'active') {
      // We could auto-redirect here, but we'll let the user click the button instead
      toast.success("Battle is now active! You can enter the battle room.");
    }
  };
  
  const handleGetReadyModal = () => {
    // Show Get Ready modal
    setShowGetReadyModal(true);
  };
  
  const handleBothPlayersReady = async () => {
    if (!battleId) return;
    
    // Update battle status to active
    await supabase
      .from('battles')
      .update({ status: 'active' })
      .eq('id', battleId);
      
    toast.success("Both players are ready! Battle is starting...");
    setPlayersReady(true);
    
    // Show get ready modal
    handleGetReadyModal();
  };

  const handleEnterBattle = () => {
    if (battleId) {
      navigate(`/battles/live/${battleId}`);
    }
  };

  return {
    battleData,
    participants,
    loading,
    showGetReadyModal,
    setShowGetReadyModal,
    battleState,
    countdown,
    spectatorCount,
    setSpectatorCount,
    playersReady,
    handleInviteContacts,
    handleEnterBattleRoom,
    handleBattleStateChange,
    handleGetReadyModal,
    handleBothPlayersReady,
    handleEnterBattle
  };
};
