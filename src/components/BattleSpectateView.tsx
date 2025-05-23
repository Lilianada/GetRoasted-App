import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Flame, MessageCircle, Users, ThumbsUp } from "lucide-react";
import Loader from "@/components/ui/loader";
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import BattleInfoCard from "./BattleSpectateView/BattleInfoCard";
import ParticipantsList from "./BattleSpectateView/ParticipantsList";
import RoastFeed from "./BattleSpectateView/RoastFeed";
import SpectatorBadge from "./BattleSpectateView/SpectatorBadge";

interface BattleSpectateViewProps {
  battleId: string;
}

interface Participant {
  id: string;
  user_id: string;
  profile: {
    username: string;
    avatar_url: string | null;
  };
}

interface Roast {
  id: string;
  content: string;
  user_id: string;
  round_number: number;
  created_at: string;
  profile: {
    username: string;
    avatar_url: string | null;
  };
}

const BattleSpectateView = ({ battleId }: { battleId: string }) => {
  const { user } = useAuthContext();
  const [battle, setBattle] = useState<any>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [spectators, setSpectators] = useState<number>(0);
  const [roasts, setRoasts] = useState<Roast[]>([]);
  const [isSpectating, setIsSpectating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentRound, setCurrentRound] = useState(1);

  useEffect(() => {
    const fetchBattleData = async () => {
      try {
        if (!battleId || battleId === 'new' || !(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(battleId))) {
          console.error('Invalid battle ID format');
          setLoading(false);
          return;
        }
        
        const { data: battleData, error: battleError } = await supabase
          .from('battles')
          .select('*, profiles(username, avatar_url)')
          .eq('id', battleId)
          .single();
          
        if (battleError) throw battleError;
        setBattle(battleData);
        
        const { data: participantsData, error: participantsError } = await supabase
          .from('battle_participants')
          .select('*, profile: profiles(username, avatar_url)')
          .eq('battle_id', battleId);
          
        if (participantsError) throw participantsError;
        setParticipants(participantsData);
        
        const { count, error: spectatorsError } = await supabase
          .from('battle_spectators')
          .select('*', { count: 'exact', head: true})
          .eq('battle_id', battleId);
          
        if (spectatorsError) throw spectatorsError;
        setSpectators(count || 0);
        
        if (user) {
          const { data: spectatorData, error: spectatorError } = await supabase
            .from('battle_spectators')
            .select('*')
            .eq('battle_id', battleId)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (spectatorError) throw spectatorError;
          setIsSpectating(!!spectatorData);
        }
        
        const { data: roastsData, error: roastsError } = await supabase
          .from('roasts')
          .select('*, profile: profiles(username, avatar_url)')
          .eq('battle_id', battleId)
          .order('round_number', { ascending: true})
          .order('created_at', { ascending: true});
          
        if (roastsError) throw roastsError;
        setRoasts(roastsData);
        
        if (roastsData.length > 0) {
          const maxRound = Math.max(...roastsData.map(roast => roast.round_number));
          setCurrentRound(maxRound);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching battle data:', error);
        toast.error("Failed to load battle data");
        setLoading(false);
      }
    };
    
    if (battleId && battleId !== 'new') {
      fetchBattleData();
    } else {
      setLoading(false);
    }
    
    const roastsSubscription = supabase
      .channel('public:roasts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'roasts', filter: `battle_id=eq.${battleId}` },
        async (payload) => {
          const { data, error } = await supabase
            .from('roasts')
            .select('*, profile: profiles(username, avatar_url)')
            .eq('id', payload.new.id)
            .single();
            
          if (error) {
            console.error('Error fetching new roast:', error);
            return;
          }
          
          setRoasts(prevRoasts => [...prevRoasts, data]);
          
          if (data.round_number > currentRound) {
            setCurrentRound(data.round_number);
          }
        }
      )
      .subscribe();
      
    const spectatorsSubscription = supabase
      .channel('public:battle_spectators')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battle_spectators', filter: `battle_id=eq.${battleId}` },
        async () => {
          const { count, error } = await supabase
            .from('battle_spectators')
            .select('*', { count: 'exact', head: true})
            .eq('battle_id', battleId);
            
          if (error) {
            console.error('Error fetching spectator count:', error);
            return;
          }
          
          setSpectators(count || 0);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(roastsSubscription);
      supabase.removeChannel(spectatorsSubscription);
    };
  }, [battleId, user, currentRound]);
  
  const handleSpectate = async () => {
    if (!user) {
      toast.error("You must be logged in to spectate battles");
      return;
    }
    
    try {
      if (!isSpectating) {
        const { error } = await supabase
          .from('battle_spectators')
          .insert({
            battle_id: battleId,
            user_id: user.id
          });
          
        if (error) throw error;
        setIsSpectating(true);
        toast.success("You are now spectating this battle");
      } else {
        const { error } = await supabase
          .from('battle_spectators')
          .delete()
          .eq('battle_id', battleId)
          .eq('user_id', user.id);
          
        if (error) throw error;
        setIsSpectating(false);
        toast.success("You are no longer spectating this battle");
      }
    } catch (error) {
      console.error('Error updating spectator status:', error);
      toast.error("Failed to update spectator status");
    }
  };

  const handleVote = async (userId: string) => {
    if (!user) {
      toast.error("You must be logged in to vote");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('battle_votes')
        .upsert({
          battle_id: battleId,
          voter_id: user.id,
          voted_for_user_id: userId,
          score: 10 // Default high score for now
        });
        
      if (error) {
        toast.error("Failed to submit vote");
      } else {
        toast.success(`Vote submitted successfully`);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast.error("Failed to submit vote");
    }
  };

  const getParticipantById = (userId: string) => {
    const participant = participants.find(p => p.user_id === userId);
    return participant ? participant.profile : { username: 'Unknown', avatar_url: null };
  };
  
  if (loading) {
    return <Loader size="large" variant="colorful" />;
  }
  
  if (!battle) {
    return <div className="text-center p-8">Battle not found</div>;
  }
  
  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className=" p-4">
            <h3 className="text-lg font-bold mb-4">Battle Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium">{battle.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created By</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={battle.profiles?.avatar_url} />
                    <AvatarFallback>{battle.profiles?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{battle.profiles?.username}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={battle.status === 'active' ? "default" : "outline"}>
                  {battle.status === 'waiting' ? 'Waiting' : 
                   battle.status === 'active' ? 'Live' : 'Completed'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rounds</p>
                <div className="flex gap-2">
                  {Array.from({ length: battle.round_count }).map((_, i) => (
                    <Badge 
                      key={i} 
                      variant={i + 1 === currentRound ? "default" : 
                               i + 1 < currentRound ? "outline" : "outline"}
                    >
                      {i + 1}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          <Card className=" p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Participants</h3>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{participants.length}</span>
              </Badge>
            </div>
            <div className="space-y-3">
              {participants.length > 0 ? (
                participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={participant.profile?.avatar_url || undefined} />
                      <AvatarFallback>{participant.profile?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{participant.profile?.username}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-2 text-muted-foreground">
                  No participants yet
                </div>
              )}
            </div>
          </Card>
          
          <Card className=" p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Spectators</h3>
              <Badge variant="outline" className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                <span>{spectators}</span>
              </Badge>
            </div>
            <div className="space-y-2">
              {user ? (
                <Button
                  className={isSpectating ? "w-full bg-night-700" : "w-full bg-yellow"}
                  onClick={handleSpectate}
                >
                  {isSpectating ? "Stop Spectating" : "Spectate Battle"}
                </Button>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  Sign in to spectate this battle
                </p>
              )}
            </div>
          </Card>
          
          {isSpectating && participants.length === 2 && battle.status === 'active' && (
            <Card className=" p-4">
              <h3 className="text-lg font-bold mb-4">Vote for Winner</h3>
              <div className="flex flex-col space-y-4">
                {participants.map((p) => (
                  <Button 
                    key={p.user_id} 
                    variant="outline" 
                    className="flex items-center gap-3"
                    onClick={() => handleVote(p.user_id)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={p.profile.avatar_url || undefined} />
                      <AvatarFallback>{p.profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>Vote for {p.profile.username}</span>
                  </Button>
                ))}
              </div>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-2">
          <Card className=" p-4 min-h-[500px]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-flame-500" />
              Live Roast Feed
            </h2>
            
            <Separator className="my-4 bg-night-700" />
            
            <div className="space-y-6">
              {roasts.length > 0 ? (
                roasts.map((roast) => {
                  const profile = getParticipantById(roast.user_id);
                  return (
                    <div key={roast.id}>
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src={profile.avatar_url || undefined} />
                          <AvatarFallback>
                            {profile.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-semibold">{profile.username}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Round {roast.round_number}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(roast.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <div className="mt-1 p-3 bg-night-800 rounded-md">
                            {roast.content}
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <Flame className="h-4 w-4 mr-1" />
                              <span>Fire</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-4 bg-night-700" />
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No roasts yet. The battle will begin soon!</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BattleSpectateView;
