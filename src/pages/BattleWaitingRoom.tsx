
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import { Copy, ArrowLeft, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";

const BattleWaitingRoom = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [battleData, setBattleData] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);
  
  const battleUrl = `${window.location.origin}/battle/join/${battleId}`;
  
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
        
        // Fetch participants
        const { data: participantsData, error: participantsError } = await supabase
          .from('battle_participants')
          .select('*, profiles:user_id(*)')
          .eq('battle_id', battleId);
          
        if (participantsError) throw participantsError;
        
        setParticipants(participantsData);
        setLoading(false);
        
        // Set up real-time subscription for participants
        const channel = supabase
          .channel('battle_participants_changes')
          .on('postgres_changes', 
            { event: 'INSERT', schema: 'public', table: 'battle_participants', filter: `battle_id=eq.${battleId}` }, 
            (payload) => {
              // Update participants when someone joins
              fetchParticipants();
            }
          )
          .subscribe();
          
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error fetching battle data:', error);
        toast.error("Failed to load battle information");
        setLoading(false);
      }
    };
    
    const fetchParticipants = async () => {
      try {
        const { data, error } = await supabase
          .from('battle_participants')
          .select('*, profiles:user_id(*)')
          .eq('battle_id', battleId);
          
        if (error) throw error;
        
        setParticipants(data);
        
        // If the battle has enough participants, redirect to the active battle
        if (data.length > 1) {
          // Update battle status to active
          await supabase
            .from('battles')
            .update({ status: 'active' })
            .eq('id', battleId);
            
          // Redirect to the battle page
          toast.success("Battle is starting!");
          navigate(`/battle/live/${battleId}`);
        }
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };
    
    fetchBattleData();
  }, [battleId, user, navigate]);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(battleUrl);
    setShowCopied(true);
    toast.success("Invitation link copied to clipboard");
    
    // Hide the "Copied" message after 2 seconds
    setTimeout(() => {
      setShowCopied(false);
    }, 2000);
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
  
  if (loading) {
    return (
      <div className="min-h-screen bg-night flex flex-col">
        
        <main className="container flex-1 py-8 flex items-center justify-center">
          <div className="text-center">Loading battle information...</div>
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
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2"
            onClick={() => navigate('/battles')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Battles
          </Button>
        </div>
        
        <Card className=" max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{battleData.title}</CardTitle>
            <CardDescription>
              Waiting for opponent to join...
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-8">
              {/* Current participants */}
              <div className="flex items-center justify-center gap-12">
                {participants.map((participant, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <Avatar className="h-20 w-20 border-2 border-flame-500">
                      <AvatarImage src={participant.profiles?.avatar_url} />
                      <AvatarFallback className="bg-night-700 text-flame-500">
                        {participant.profiles?.username?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-lg">{participant.profiles?.username || "Unknown"}</span>
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
                      <span className="font-semibold text-lg text-night-400">Waiting...</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="w-full max-w-md space-y-4">
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
                      <span className="text-xs font-medium text-green-500">Copied!</span>
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
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t border-night-800 pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>Battle will automatically start when an opponent joins.</p>
              <p className="mt-2">Round count: {battleData.round_count} • Type: {battleData.type}</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BattleWaitingRoom;
