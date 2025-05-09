
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft, Timer, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";
import Loader from "@/components/ui/loader";
import BattleReadyConfirmation from "@/components/battle/BattleReadyConfirmation";
import BattlePresenceManager from "@/components/BattlePresenceManager";
import BattleCodeDisplay from "@/components/battle/BattleCodeDisplay";
import BattleParticipantsDisplay from "@/components/battle/BattleParticipantsDisplay";
import GetReadyModal from "@/components/battle/GetReadyModal";
import { shareWithContacts } from "@/utils/battleSharingUtils";

const BattleWaitingRoom = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [battleData, setBattleData] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGetReadyModal, setShowGetReadyModal] = useState(false);
  const [battleState, setBattleState] = useState<'waiting' | 'ready' | 'active' | 'completed'>('waiting');
  const [countdown, setCountdown] = useState(3);
  const [spectatorCount, setSpectatorCount] = useState(0);
  
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
    
    if (countdown <= 0) {
      setShowGetReadyModal(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [showGetReadyModal, countdown]);
  
  const handleInviteContacts = () => {
    if (!battleData?.invite_code) return;
    shareWithContacts(battleData.invite_code);
  };
  
  const handleEnterBattleRoom = () => {
    if (battleData?.status === 'active') {
      navigate(`/battles/live/${battleId}`);
    } else if (participants.length >= 2) {
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
    
    // Auto-close the modal after 3 seconds
    setTimeout(() => {
      setShowGetReadyModal(false);
      // Auto-redirect to battle room after modal closes
      if (battleId) {
        navigate(`/battles/live/${battleId}`);
      }
    }, 3000);
  };
  
  const handleBothPlayersReady = async () => {
    if (!battleId) return;
    
    // Update battle status to active
    await supabase
      .from('battles')
      .update({ status: 'active' })
      .eq('id', battleId);
      
    toast.success("Both players are ready! Battle is starting...");
    
    // Show get ready modal and redirect
    handleGetReadyModal();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-night flex flex-col">
        <main className="container flex-1 py-8 flex items-center justify-center">
          <Loader size="large" variant="colorful" />
        </main>
      </div>
    );
  }
  
  if (!battleData) {
    return (
      <div className="min-h-screen bg-night flex flex-col">
        <div className="container py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Battle Not Found</h2>
            <p className="text-muted-foreground mb-6">The battle you're looking for doesn't exist or has been deleted.</p>
            <Button onClick={() => navigate('/battles')}>
              Return to Battles
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-night flex flex-col">
      {/* Battle Presence Manager */}
      {battleId && (
        <BattlePresenceManager 
          battleId={battleId}
          onParticipantCountChange={(count) => console.log('Participant count:', count)}
          onSpectatorCountChange={setSpectatorCount}
          onBattleStateChange={handleBattleStateChange}
          onGetReadyModal={handleGetReadyModal}
          maxParticipants={2}
        />
      )}
      
      <div className="container py-8">      
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{battleData.title}</CardTitle>
            <CardDescription>
              {participants.length < 2 ? "Waiting for opponent to join..." : "Both players must type 'Start' to begin"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Battle code display component */}
            <BattleCodeDisplay 
              inviteCode={battleData.invite_code || '------'} 
              onInviteContacts={handleInviteContacts} 
            />
          
            <div className="flex flex-col items-center justify-center space-y-8">
              {/* Battle Timer Info */}
              <div className="w-full flex justify-center items-center space-x-2 bg-secondary/20 px-4 py-2 rounded-lg">
                <Timer className="w-5 h-5 text-flame-500" />
                <span>Time per turn: {battleData.time_per_turn / 60} minutes</span>
              </div>
              
              {/* Battle participants display */}
              <BattleParticipantsDisplay 
                participants={participants}
                maxParticipants={2}
              />
              
              {/* Ready confirmation for starting the battle */}
              {participants.length > 0 && (
                <BattleReadyConfirmation 
                  battleId={battleId || ''}
                  onBothPlayersReady={handleBothPlayersReady}
                  participantCount={participants.length}
                />
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t border-night-800 pt-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/battles')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Lobby
            </Button>
            
            {participants.length >= 1 && (
              <Button
                className="bg-flame-500 hover:bg-flame-600 text-white gap-2"
                onClick={handleEnterBattleRoom}
              >
                Enter Battle Room
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      
      {/* Get Ready Modal component */}
      <GetReadyModal 
        open={showGetReadyModal} 
        onOpenChange={setShowGetReadyModal}
        countdown={countdown}
      />
    </div>
  );
};

export default BattleWaitingRoom;
