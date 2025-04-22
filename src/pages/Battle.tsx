
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import Loader from "@/components/ui/loader";
import { useParams, useNavigate } from "react-router-dom";
import { useBattle, useBattleParticipants, useSpectatorCount, useBattleVotes, useVoteMutation } from "@/hooks/useBattleData";
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
  const [participantScores, setParticipantScores] = useState<Record<string, number>>({});
  const [userVote, setUserVote] = useState<string | null>(null);
  const [canVote, setCanVote] = useState(false);

  const { data: battle, isLoading: battleLoading, error: battleError } = useBattle(battleId);
  const { data: participantsData = [], isLoading: participantsLoading } = useBattleParticipants(battleId);
  const { data: votes = [], isLoading: votesLoading } = useBattleVotes(battleId);
  const voteMutation = useVoteMutation();

  // Transform participants data with scores
  const participants: Participant[] = participantsData.map(p => ({
    id: p.id,
    username: p.username || 'Unknown',
    avatar_url: p.avatar_url,
    score: participantScores[p.id] || 0
  }));

  // Load battle details and set up initial state
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
        
        if (data && data.status === 'completed') {
          setBattleEnded(true);
        }
      } catch (error) {
        console.error('Error fetching battle time details:', error);
      }
    };
    
    fetchBattleDetails();
    
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

  // Check user role (participant or spectator)
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

  // Calculate participant scores whenever votes change
  useEffect(() => {
    if (!votes || votes.length === 0) return;
    
    // Group votes by voted_for_user_id
    const votesByParticipant: Record<string, number[]> = {};
    
    votes.forEach(vote => {
      if (!votesByParticipant[vote.voted_for_user_id]) {
        votesByParticipant[vote.voted_for_user_id] = [];
      }
      votesByParticipant[vote.voted_for_user_id].push(vote.score);
    });
    
    // Calculate total score for each participant
    const scores: Record<string, number> = {};
    
    Object.entries(votesByParticipant).forEach(([userId, userScores]) => {
      // Calculate the sum of all scores for this user
      scores[userId] = userScores.reduce((sum, score) => sum + score, 0);
    });
    
    setParticipantScores(scores);
    
    // Check if current user has already voted
    if (user) {
      const userVoteRecord = votes.find(vote => vote.voter_id === user.id);
      if (userVoteRecord) {
        setUserVote(userVoteRecord.voted_for_user_id);
      }
    }
  }, [votes, user]);

  // Handle voting permission
  useEffect(() => {
    if (!isSpectator || !user) {
      setCanVote(false);
      return;
    }
    
    // Spectators can vote during active battles or right after they end
    setCanVote(battleState === 'active' || battleEnded);
  }, [isSpectator, user, battleState, battleEnded]);

  if (battleLoading || participantsLoading) {
    return <div className="flex justify-center items-center min-h-[300px]"><Loader size="large" variant="colorful" /></div>;
  }
  if (battleError || !battle) {
    return <div className="text-center text-red-500 py-12">Failed to load battle data.</div>;
  }

  // Sync timer between clients
  const syncTimer = (remainingTime: number) => {
    if (!battleId) return;
    
    const channel = supabase.channel(`battle-timer-${battleId}`);
    channel.send({
      type: 'broadcast',
      event: 'timer-update',
      payload: { timeRemaining: remainingTime }
    });
  };

  // Handle sending a roast
  const handleSendRoast = async () => {
    if (roastInput.trim() === "") return;
    if (isSpectator) {
      toast.error("Spectators cannot send roasts!");
      return;
    }
    
    try {
      if (!user || !battleId) {
        toast.error("Unable to send roast. Please try again.");
        return;
      }
      
      const { error } = await supabase
        .from('roasts')
        .insert({
          battle_id: battleId,
          user_id: user.id,
          content: roastInput,
          round_number: currentRound
        });
      
      if (error) throw error;
      
      toast.success("Roast submitted!");
      setRoastInput("");
      
      // Move to the next player's turn
      const currentPlayerIndex = participants.findIndex(p => p.id === currentTurnUserId);
      const nextPlayerIndex = (currentPlayerIndex + 1) % participants.length;
      const nextPlayer = participants[nextPlayerIndex];
      
      if (nextPlayer) {
        setCurrentTurnUserId(nextPlayer.id);
        setTimeRemaining(timePerTurn);
        syncTimer(timePerTurn);
      }
      
      // If we've gone through all players in this round, show the round summary
      if (nextPlayerIndex === 0 && currentRound >= 1) {
        if (currentRound >= (battle.round_count || 3)) {
          // Battle is completed after this round
          const highestScoringPlayer = [...participants].sort((a, b) => (b.score || 0) - (a.score || 0))[0];
          setWinner(highestScoringPlayer);
          setBattleEnded(true);
          
          // Update battle status to completed
          await supabase
            .from('battles')
            .update({ status: 'completed' })
            .eq('id', battleId);
        } else {
          setShowRoundSummary(true);
        }
      }
    } catch (error) {
      console.error('Error sending roast:', error);
      toast.error("Failed to send roast. Please try again.");
    }
  };
  
  // Handle sending a chat message
  const handleSendChat = () => {
    if (chatInput.trim() === "") return;
    
    toast.success("Message sent!");
    setChatInput("");
  };
  
  // Handle timer updates
  const handleTimerUpdate = (newTime: number) => {
    setTimeRemaining(newTime);
    syncTimer(newTime);
  };
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  
  // Calculate the percentage of time remaining
  const timePercentage = (timeRemaining / timePerTurn) * 100;
  
  // Check if it's the current player's turn
  const isPlayerTurn = () => {
    if (!user || isSpectator) return false;
    
    const currentUserParticipant = participants.find(p => p.user_id === user.id);
    
    return battleState === 'active' && 
           currentUserParticipant && 
           currentTurnUserId === currentUserParticipant.id;
  };
  
  // Handle battle state changes
  const handleBattleStateChange = (newState: 'waiting' | 'ready' | 'active' | 'completed') => {
    setBattleState(newState);
    
    if (newState === 'active' && participants.length > 0 && !currentTurnUserId) {
      // When battle starts, randomly select the first player
      const firstPlayer = participants[Math.floor(Math.random() * participants.length)];
      setCurrentTurnUserId(firstPlayer.id);
    }
    
    if (newState === 'completed') {
      setBattleEnded(true);
      
      // Find the highest scoring player
      if (participants.length > 0) {
        const highestScoringPlayer = [...participants].sort((a, b) => (b.score || 0) - (a.score || 0))[0];
        setWinner(highestScoringPlayer);
      }
    }
  };

  // Handle advancing to the next round
  const handleNextRound = () => {
    setShowRoundSummary(false);
    setCurrentRound(prev => prev + 1);
    setTimeRemaining(timePerTurn);
    syncTimer(timePerTurn);
    
    // Randomly select the first player for the new round
    const firstPlayer = participants[Math.floor(Math.random() * participants.length)];
    if (firstPlayer) {
      setCurrentTurnUserId(firstPlayer.id);
    }
  };

  // Handle rematch
  const handleRematch = async () => {
    if (!battleId || !user) return;
    
    try {
      // Create a new battle with the same settings
      const { data, error } = await supabase
        .from('battles')
        .insert({
          title: `Rematch: ${battle.title}`,
          type: battle.type,
          status: 'waiting',
          round_count: battle.round_count,
          time_per_turn: battle.time_per_turn,
          allow_spectators: battle.allow_spectators,
          created_by: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Navigate to the new battle
        navigate(`/battles/${data.id}`);
      }
    } catch (error) {
      console.error('Error creating rematch:', error);
      toast.error("Failed to create rematch. Please try again.");
    }
  };

  // Handle voting
  const handleVote = async (votedForId: string) => {
    if (!user || !battleId) {
      toast.error("You need to be logged in to vote");
      return;
    }
    
    try {
      await voteMutation.mutate(
        { 
          battleId, 
          voterId: user.id, 
          votedForId, 
          score: 10 // Simple scoring system: 10 points per vote
        },
        {
          onSuccess: () => {
            toast.success("Vote submitted!");
            setUserVote(votedForId);
          },
          onError: (error) => {
            toast.error("Failed to submit vote");
            console.error('Vote error:', error);
          }
        }
      );
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast.error("Failed to submit vote");
    }
  };

  // Handle turn changes when timer reaches 0
  useEffect(() => {
    if (timeRemaining === 0 && !showRoundSummary && !battleEnded) {
      const currentPlayerIndex = participants.findIndex(p => p.id === currentTurnUserId);
      const nextPlayerIndex = (currentPlayerIndex + 1) % participants.length;
      const nextPlayer = participants[nextPlayerIndex];
      
      if (nextPlayer) {
        setCurrentTurnUserId(nextPlayer.id);
        setTimeRemaining(timePerTurn);
        syncTimer(timePerTurn);
      }
      
      // Check if the round is complete
      if (nextPlayerIndex === 0) {
        if (currentRound >= battle.round_count) {
          // Battle is complete
          setBattleEnded(true);
          
          // Find the highest scoring player
          const highestScoringPlayer = [...participants].sort((a, b) => (b.score || 0) - (a.score || 0))[0];
          setWinner(highestScoringPlayer);
          
          // Update battle status
          supabase
            .from('battles')
            .update({ status: 'completed' })
            .eq('id', battleId)
            .then(() => {
              console.log('Battle marked as completed');
            })
            .catch(err => {
              console.error('Error updating battle status:', err);
            });
        } else {
          setShowRoundSummary(true);
        }
      }
    }
  }, [timeRemaining, currentTurnUserId, participants, currentRound, battle?.round_count, timePerTurn, showRoundSummary, battleEnded, battleId]);

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
            canVote={canVote}
            onVote={handleVote}
            userVote={userVote}
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
