
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
  const [roundPrompt, setRoundPrompt] = useState<string>("Round 1 - Introduce yourself");
  const [timePerTurn, setTimePerTurn] = useState<number>(180); // Default to 3 minutes
  const [timeRemaining, setTimeRemaining] = useState<number>(180);
  const [battleState, setBattleState] = useState<'waiting' | 'ready' | 'active' | 'completed'>('waiting');
  const [spectatorCount, setSpectatorCount] = useState(0);

  // Fetch battle data
  const { data: battle, isLoading: battleLoading, error: battleError } = useBattle(battleId);
  const { data: participantsData = [], isLoading: participantsLoading } = useBattleParticipants(battleId);

  // Convert participants to the required Participant type
  const participants: Participant[] = participantsData.map(p => ({
    id: p.id,
    username: p.username || 'Unknown',
    avatar_url: p.avatar_url
  }));

  useEffect(() => {
    if (!battleId) return;
    
    // Fetch battle time_per_turn
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
    
    // Subscribe to real-time updates for battle timer synchronization
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

  // Check if user is a spectator
  useEffect(() => {
    if (!battleId || !user) return;
    
    const checkUserRole = async () => {
      try {
        // Check if user is a participant
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
        
        // Not a participant, so check if they're a spectator
        const { data: isSpectator } = await supabase
          .from('battle_spectators')
          .select('id')
          .eq('battle_id', battleId)
          .eq('user_id', user.id)
          .single();
          
        if (isSpectator) {
          setIsSpectator(true);
        } else {
          // User is neither a participant nor a spectator
          // Join as spectator automatically
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

  // Wait for all data to load
  const loading = battleLoading || participantsLoading;

  if (loading) {
    return <div className="flex justify-center items-center min-h-[300px]"><Loader size="large" variant="colorful" /></div>;
  }
  if (battleError || !battle) {
    return <div className="text-center text-red-500 py-12">Failed to load battle data.</div>;
  }

  // Sync timer with other participants
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
    // Only participants can have a turn, spectators never have a turn
    if (isSpectator) return false;
    
    // TODO: Implement real turn logic when available
    return battleState === 'active' && !isSpectator;
  };
  
  const handleBattleStateChange = (newState: 'waiting' | 'ready' | 'active' | 'completed') => {
    setBattleState(newState);
  };

  return (
    <div className="min-h-screen bg-night flex flex-col">
      {/* Battle Presence Manager */}
      {battleId && (
        <BattlePresenceManager 
          battleId={battleId}
          onParticipantCountChange={() => {}}
          onSpectatorCountChange={setSpectatorCount}
          onBattleStateChange={handleBattleStateChange}
        />
      )}
      
      <main className="container flex-1 py-8">
        <div className="mb-4">
          <div className="bg-secondary/20 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Round {currentRound}</h2>
            <p className="text-muted-foreground">{roundPrompt}</p>
            
            {/* Battle state indicator */}
            <div className="mt-2 flex items-center justify-between">
              <div>
                <span className="text-sm text-muted-foreground">Battle Status: </span>
                <span className={`text-sm font-medium ${
                  battleState === 'active' ? 'text-green-500' : 
                  battleState === 'waiting' ? 'text-amber-500' :
                  battleState === 'completed' ? 'text-blue-500' : ''
                }`}>
                  {battleState === 'active' ? 'Active' : 
                   battleState === 'waiting' ? 'Waiting for participants' : 
                   battleState === 'ready' ? 'Ready to start' : 
                   battleState === 'completed' ? 'Completed' : 'Unknown'}
                </span>
              </div>
              
              {isSpectator && (
                <span className="text-sm bg-flame-500 text-white px-2 py-1 rounded">
                  Spectator Mode
                </span>
              )}
              
              <div>
                <span className="text-sm text-muted-foreground">Spectators: </span>
                <span className="text-sm">{spectatorCount}</span>
              </div>
            </div>
          </div>
        </div>
        
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
