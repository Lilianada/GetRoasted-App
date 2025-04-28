
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import { Copy, ArrowLeft, Share2, Check, Timer, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import BattleTimer from "@/components/BattleTimer";
import BattlePresenceManager from "@/components/BattlePresenceManager";

const BattleWaitingRoom = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [battleData, setBattleData] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);
  const [showGetReadyModal, setShowGetReadyModal] = useState(false);
  const [battleState, setBattleState] = useState<'waiting' | 'ready' | 'active' | 'completed'>('waiting');
  const [countdown, setCountdown] = useState(3);
  const [spectatorCount, setSpectatorCount] = useState(0);
  
  const battleUrl = `${window.location.origin}/battles/join/${battleId}`;
  
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
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(battleUrl);
    setShowCopied(true);
    toast.success("Invitation link copied!");
    
    // Hide the checkmark after 2 seconds
    setTimeout(() => {
      setShowCopied(false);
    }, 2000);
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
  
  const handleInviteContacts = () => {
    const message = `Join my roast battle on GetRoasted! ${battleUrl}`;
    
    // Check if we can use the Share API
    if (navigator.share) {
      navigator.share({
        title: "Join my Roast Battle",
        text: message,
        url: battleUrl
      }).catch((err) => {
        console.error('Error sharing:', err);
        fallbackShare(message);
      });
    } else {
      fallbackShare(message);
    }
  };
  
  const fallbackShare = (message: string) => {
    // Create a modal or dialog with options to share
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    const emailUrl = `mailto:?subject=Join my Roast Battle&body=${encodeURIComponent(message)}`;
    
    // Open a small window with sharing options
    const shareWindow = window.open("", "Share", "width=600,height=400");
    if (shareWindow) {
      shareWindow.document.write(`
        <html>
          <head>
            <title>Share Battle Invitation</title>
            <style>
              body { font-family: Arial, sans-serif; background: #111; color: white; padding: 20px; }
              h2 { color: #ff5722; }
              .btn { display: block; margin: 10px 0; padding: 10px; background: #333; color: white; text-decoration: none; border-radius: 5px; }
              .btn:hover { background: #444; }
            </style>
          </head>
          <body>
            <h2>Share Battle Invitation</h2>
            <a href="${whatsappUrl}" class="btn" target="_blank">Share via WhatsApp</a>
            <a href="${twitterUrl}" class="btn" target="_blank">Share via Twitter</a>
            <a href="${emailUrl}" class="btn" target="_blank">Share via Email</a>
            <p style="margin-top: 20px;">Or copy this link:</p>
            <input type="text" value="${battleUrl}" style="width: 100%; padding: 5px;" onclick="this.select();">
          </body>
        </html>
      `);
    } else {
      // If popup blocked, just copy to clipboard
      navigator.clipboard.writeText(message);
      toast.success("Invitation copied to clipboard", {
        description: "Share it with your friends"
      });
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
              {participants.length < 2 ? "Waiting for opponent to join..." : "Battle starting soon!"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-8">
              {/* Battle Timer Info */}
              <div className="w-full flex justify-center items-center space-x-2 bg-secondary/20 px-4 py-2 rounded-lg">
                <Timer className="w-5 h-5 text-flame-500" />
                <span>Time per turn: {battleData.time_per_turn / 60} minutes</span>
              </div>
              
              {/* Current participants */}
              <div className="flex items-center justify-center gap-12">
                {participants.map((participant, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <Avatar className="h-20 w-20 border-2 border-flame-500 rounded-full">
                      <AvatarImage src={participant.profiles?.avatar_url} />
                      <AvatarFallback className="bg-night-700 text-flame-500">
                        {participant.profiles?.username?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-lg capitalize">{participant.profiles?.username || "Unknown"}</span>
                  </div>
                ))}
                
                {/* Placeholder for waiting opponent */}
                {participants.length < 2 && (
                  <>
                    <span className="text-flame-500 font-bold text-xl">VS</span>
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-20 w-20 border-2 border-dashed border-night-500 rounded-full flex items-center justify-center">
                        <span className="text-night-400 text-3xl">?</span>
                      </div>
                      <span className="font-semibold text-lg text-night-400">Waiting</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="w-full max-w-md space-y-4">
                {participants.length < 2 ? (
                  <>
                    <h3 className="text-lg font-semibold text-center">Invite an Opponent</h3>
                    
                    <div className="flex items-center gap-2 relative">
                      <Input
                        value={battleUrl}
                        readOnly
                        onClick={handleCopyLink}
                        className="pr-10 border-night-700"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-0 border-night-700"
                        onClick={handleCopyLink}
                      >
                        {showCopied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-night-700 gap-2"
                      onClick={handleInviteContacts}
                    >
                      <Share2 className="h-4 w-4" />
                      Invite from Contacts
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4 mt-6">
                    <p className="text-center text-green-500 font-medium">
                      Opponent has joined! Ready to start the battle?
                    </p>
                    {battleState === 'waiting' ? (
                      <p className="text-sm text-muted-foreground">
                        The battle will begin automatically when both players are ready.
                      </p>
                    ) : (
                      <Button
                        className="bg-flame-500 hover:bg-flame-600 text-white gap-2"
                        onClick={handleEnterBattleRoom}
                      >
                        Enter Battle Room
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
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
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      
      {/* Get Ready Modal */}
      <Dialog open={showGetReadyModal} onOpenChange={setShowGetReadyModal}>
        <DialogContent className="bg-night-800 border-flame-500 max-w-md text-center p-8">
          <DialogTitle className="text-3xl font-bold text-flame-500">Get Ready!</DialogTitle>
          <div className="flex flex-col items-center justify-center gap-6 py-6">
            <div className="w-24 h-24 rounded-full bg-flame-500 flex items-center justify-center text-4xl font-bold text-white">
              {countdown}
            </div>
            <p className="text-lg">Your battle is about to begin...</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BattleWaitingRoom;
