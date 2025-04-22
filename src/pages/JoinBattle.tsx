
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flame, ArrowLeft, Eye } from "lucide-react";
import { toast } from "@/components/ui/sonner";


import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";
import Loader from "@/components/ui/loader";

const JoinBattle = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthContext();
  const [battleData, setBattleData] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBattleData = async () => {
      if (!battleId) return;
      
      try {
        const { data: battle, error: battleError } = await supabase
          .from('battles')
          .select('*')
          .eq('id', battleId)
          .single();
          
        if (battleError) throw battleError;
        
        // If battle is not in waiting status, redirect appropriately
        if (battle.status === 'active') {
          navigate(`/battles/${battleId}`);
          return;
        } else if (battle.status === 'completed') {
          navigate(`/battles/results/${battleId}`);
          return;
        }
        
        setBattleData(battle);
        
        // Fetch creator info
        if (battle.created_by) {
          const { data: creatorData, error: creatorError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', battle.created_by)
            .single();
            
          if (!creatorError) {
            setCreator(creatorData);
          }
        }
        
        // Check if user is already a participant
        if (user) {
          const { data: existingParticipant } = await supabase
            .from('battle_participants')
            .select('*')
            .eq('battle_id', battleId)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (existingParticipant) {
            navigate(`/battles/waiting/${battleId}`);
            return;
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching battle:', error);
        toast.error("Failed to load battle information");
        navigate('/battles');
      }
    };
    
    if (!authLoading) {
      fetchBattleData();
    }
  }, [battleId, user, authLoading, navigate]);
  
  const handleJoinAsSpectator = async () => {
    if (!user || !battleId) {
      toast.error("You must be logged in to spectate battles");
      return;
    }
    
    try {
      // Add user as spectator
      const { error } = await supabase
        .from('battle_spectators')
        .insert({
          battle_id: battleId,
          user_id: user.id
        });
        
      if (error) throw error;
      
      toast.success("Joined as spectator");
      navigate(`/battles/${battleId}`);
    } catch (error) {
      console.error('Error joining as spectator:', error);
      toast.error("Failed to join as spectator");
    }
  };
  
  const handleJoinBattle = async () => {
    if (!user || !battleId) {
      toast.error("You must be logged in to join battles");
      return;
    }
    
    setIsJoining(true);
    
    try {
      // Check participants count
      const { data: participants, error: countError } = await supabase
        .from('battle_participants')
        .select('*', { count: 'exact' })
        .eq('battle_id', battleId);
        
      if (countError) throw countError;
      
      if (participants && participants.length >= 2) {
        toast.error("This battle already has the maximum number of participants");
        setIsJoining(false);
        return;
      }
      
      // Add user as participant
      const { error: joinError } = await supabase
        .from('battle_participants')
        .insert({
          battle_id: battleId,
          user_id: user.id
        });
        
      if (joinError) throw joinError;
      
      // If this is the second participant, update battle status to active
      if (participants && participants.length === 1) {
        await supabase
          .from('battles')
          .update({ status: 'active' })
          .eq('id', battleId);

        // Send notification to the creator
        if (battleData && battleData.created_by && user) {
          let joinerName = '';
          // Try to get the joiner's username from the profile
          const { data: joinerProfile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();
          if (joinerProfile && joinerProfile.username) {
            joinerName = joinerProfile.username;
          } else if (user.email) {
            joinerName = user.email;
          } else {
            joinerName = 'A user';
          }
          await supabase.from('notifications').insert({
            user_id: battleData.created_by,
            title: 'Your battle is starting!',
            message: `${joinerName} has joined your battle. Get ready to roast!`,
            action_url: `/battles/live/${battleId}`,
            created_at: new Date().toISOString(),
          });
        }

        toast.success("Battle joined! Get ready to roast!");
        navigate(`/battles/live/${battleId}`);
      } else {
        toast.success("Battle joined! Waiting for an opponent.");
        navigate(`/battles/waiting/${battleId}`);
      }
    } catch (error) {
      console.error('Error joining battle:', error);
      toast.error("Failed to join battle");
      setIsJoining(false);
    }
  };
  
  // Show login/signup prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-night flex flex-col">
        
        <div className="container flex-1 flex items-center justify-center">
          <Card className="bg-yellow border-2 border-black w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Join Battle</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6">You need to sign in or create an account to join this battle.</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/signup', { state: { returnTo: `/battles/join/${battleId}` } })}>
                  Sign In / Sign Up
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-night flex flex-col">
        
        <div className="container flex-1 flex items-center justify-center">
          <Loader size="large" variant="colorful" />
        </div>
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
        
        <Card className="bg-yellow border-2 border-black max-w-lg mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{battleData.title}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              {creator ? (
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-16 w-16 border-2 border-flame-500">
                    <AvatarImage src={creator.avatar_url} />
                    <AvatarFallback className="bg-night-700 text-flame-500">
                      {creator.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-center">
                    <div className="font-medium">{creator.username}</div>
                    <div className="text-sm text-muted-foreground">Battle Creator</div>
                  </span>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">Battle waiting for participants</div>
              )}
            </div>
            
            <div className="text-center space-y-2">
              <p><span className="font-semibold">Type:</span> {battleData.type === 'private' ? 'Private' : 'Public'}</p>
              <p><span className="font-semibold">Rounds:</span> {battleData.round_count}</p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              className="w-full gap-2 bg-yellow hover:opacity-90" 
              onClick={handleJoinBattle}
              disabled={isJoining}
            >
              <Flame className="h-4 w-4" />
              {isJoining ? 'Joining...' : 'Join Battle'}
            </Button>
            
            <Button 
              variant="outline"
              className="w-full gap-2 border-night-700" 
              onClick={handleJoinAsSpectator}
              disabled={isJoining}
            >
              <Eye className="h-4 w-4" />
              Join as Spectator
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default JoinBattle;
