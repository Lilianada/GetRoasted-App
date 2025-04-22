import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import Loader from "@/components/ui/loader";
import { useParams, useNavigate } from "react-router-dom";
import { useBattle, useBattleParticipants, useSpectatorCount } from "@/hooks/useBattleData";
import BattleArena from "./BattleArena";
import BattleChatPanel from "./BattleChatPanel";
import { Participant } from "@/types/battle";
import { supabase } from "@/integrations/supabase/client";
import BattleTimer from "@/components/BattleTimer";
import BattlePresenceManager from "@/components/BattlePresenceManager";
import { useAuthContext } from "@/context/AuthContext";

const Battle = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [roastInput, setRoastInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [isSpectator, setIsSpectator] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [showRoundSummary, setShowRoundSummary] = useState(false);
  const [battleEnded, setBattleEnded] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  const [currentTurnUserId, setCurrentTurnUserId] = useState<string | undefined>();
  const [timePerTurn, setTimePerTurn] = useState<number>(180); // Default to 3 minutes
  const [timeRemaining, setTimeRemaining] = useState<number>(180);
  const [battleState, setBattleState] = useState<'waiting' | 'ready' | 'active' | 'completed'>('waiting');
  const [spectatorCount, setSpectatorCount] = useState(0);

  const { data: battle, isLoading: battleLoading, error: battleError } = useBattle(battleId);
  const { data: participantsData = [], isLoading: participantsLoading } = useBattleParticipants(battleId);

  const participants: Participant[] = participantsData.map(p => ({
    id: p.id,
    username: p.username || 'Unknown',
    avatar_url: p.avatar_url
  }));

  useEffect(() => {
    if (!battleId) return;
    
    const fetchBattleDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('battles')
          .select('time_per_turn, status')
          .eq('id', battleId)
          .single();
          
        if (error) throw error;
        
        if (data && data.time_per_turn) {
          setTimePerTurn(data.time_per_turn);
          setTimeRemaining(data.time_per_turn);
        }
      } catch (error) {
        console.error('Error fetching battle time details:', error);
      }
    };
    
    fetchBattleDetails();
    
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

  useEffect(() => {
    if (!battleId || !user) return;
    
    const checkUserRole = async () => {
      try {
        const { data: isParticipant } = await supabase
          .from('battle_participants')
          .select('id')
          .eq('battle_id', battleId)
          .eq('user_id', user.id)
          .single();
          
        if (isParticipant) {
          setIsSpectator(false);
          return;
        }
        
        const { data: isSpectator } = await supabase
          .from('battle_spectators')
          .select('id')
          .eq('battle_id', battleId)
          .eq('user_id', user.id)
          .single();
          
        if (isSpectator) {
          setIsSpectator(true);
        } else {
          const { error } = await supabase
            .from('battle_spectators')
            .insert({
              battle_id: battleId,
              user_id: user.id
            });
            
          if (error) throw error;
          setIsSpectator(true);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };
    
    checkUserRole();
  }, [battleId, user]);

  const loading = battleLoading || participantsLoading;

  if (loading) {
    return <div className="flex justify-center items-center min-h-[300px]"><Loader size="large" variant="colorful" /></div>;
  }
  if (battleError || !battle) {
    return <div className="text-center text-red-500 py-12">Failed to load battle data.</div>;
  }

  const syncTimer = (remainingTime: number) => {
    if (!battleId) return;
    
    const channel = supabase.channel(`battle-timer-${battleId}`);
    channel.send({
      type: 'broadcast',
      event: 'timer-update',
      payload: { timeRemaining: remainingTime }
    });
  };

  const handleSendRoast = () => {
    if (roastInput.trim() === "") return;
    if (isSpectator) {
      toast.error("Spectators cannot send roasts!");
      return;
    }
    
    toast.success("Roast submitted!");
    setRoastInput("");
  };
  
  const handleSendChat = () => {
    if (chatInput.trim() === "") return;
    
    toast.success("Message sent!");
    setChatInput("");
  };
  
  const handleTimerUpdate = (newTime: number) => {
    setTimeRemaining(newTime);
    syncTimer(newTime);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  
  const timePercentage = (timeRemaining / timePerTurn) * 100;
  
  const isPlayerTurn = () => {
    if (isSpectator) return false;
    
    return battleState === 'active' && !isSpectator;
  };
  
  const handleBattleStateChange = (newState: 'waiting' | 'ready' | 'active' | 'completed') => {
    setBattleState(newState);
  };

  const handleNextRound = () => {
    setShowRoundSummary(false);
    setCurrentRound(prev => prev + 1);
    setTimeRemaining(timePerTurn);
    
    const firstPlayer = participants[Math.floor(Math.random() * participants.length)];
    if (firstPlayer) {
      setCurrentTurnUserId(firstPlayer.id);
    }
  };

  const handleRematch = () => {
    setCurrentRound(1);
    setBattleEnded(false);
    setWinner(null);
    setShowRoundSummary(false);
    setTimeRemaining(timePerTurn);
  };

  useEffect(() => {
    if (timeRemaining === 0 && !showRoundSummary && !battleEnded) {
      const currentPlayerIndex = participants.findIndex(p => p.id === currentTurnUserId);
      const nextPlayerIndex = (currentPlayerIndex + 1) % participants.length;
      const nextPlayer = participants[nextPlayerIndex];
      
      if (nextPlayer) {
        setCurrentTurnUserId(nextPlayer.id);
        setTimeRemaining(timePerTurn);
      }
      
      if (nextPlayerIndex === 0) {
        if (currentRound >= battle.round_count) {
          setBattleEnded(true);
          setWinner(participants[0]);
        } else {
          setShowRoundSummary(true);
        }
      }
    }
  }, [timeRemaining, currentTurnUserId, participants, currentRound, battle?.round_count, timePerTurn]);

  return (
    <div className="min-h-screen bg-night flex flex-col">
      {battleId && (
        <BattlePresenceManager 
          battleId={battleId}
          onParticipantCountChange={() => {}}
          onSpectatorCountChange={setSpectatorCount}
          onBattleStateChange={handleBattleStateChange}
        />
      )}
      
      <main className="container flex-1 py-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <BattleArena
            participants={participants}
            spectatorCount={spectatorCount}
            roastInput={roastInput}
            setRoastInput={setRoastInput}
            isSpectator={isSpectator}
            showChat={showChat}
            setShowChat={setShowChat}
            timeRemaining={timeRemaining}
            timePercentage={timePercentage}
            formatTime={formatTime}
            isPlayerTurn={isPlayerTurn}
            handleSendRoast={handleSendRoast}
            currentRound={currentRound}
            totalRounds={battle?.round_count || 3}
            currentTurnUserId={currentTurnUserId}
            showRoundSummary={showRoundSummary}
            onNextRound={handleNextRound}
            battleEnded={battleEnded}
            winner={winner}
            onRematch={handleRematch}
          />
          
          <BattleChatPanel
            spectatorCount={spectatorCount}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleSendChat={handleSendChat}
            showChat={showChat}
            isSpectator={isSpectator}
          />
        </div>
      </main>
    </div>
  );
};

export default Battle;
