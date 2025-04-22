import { useState, useEffect } from "react";
import BattleCard from "@/components/BattleCard";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BattleSearch from "@/components/BattleSearch";
import JoinPrivateBattleDialog from "@/components/JoinPrivateBattleDialog";
import { toast } from "@/components/ui/sonner";
import { useAuthContext } from "@/context/AuthContext";

interface BattleData {
  id: string;
  title: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  spectatorCount: number;
  status: 'waiting' | 'active' | 'completed';
  timeRemaining?: number;
  type: 'public' | 'private';
  roundCount: number;
  timePerTurn?: number;
}

const BattleLobby = () => {
  const [battles, setBattles] = useState<BattleData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  
  useEffect(() => {
    const fetchBattles = async () => {
      try {
        const { data, error } = await supabase
          .from('battles')
          .select(`
            *,
            battle_participants(
              *,
              profiles:user_id(*)
            ),
            battle_spectators(count)
          `)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Format the data to match our BattleCard props
        const formattedBattles = data.map(battle => ({
          id: battle.id,
          title: battle.title,
          participants: battle.battle_participants.map((p: any) => ({
            id: p.user_id,
            name: p.profiles.username,
            avatar: p.profiles.avatar_url
          })),
          // Fix: Extract the count number correctly
          spectatorCount: Array.isArray(battle.battle_spectators) && battle.battle_spectators.length > 0 
            ? battle.battle_spectators[0]?.count || 0 
            : 0,
          // Explicitly cast status to the correct type
          status: battle.status as 'waiting' | 'active' | 'completed',
          timeRemaining: undefined, // We don't have this info yet
          type: battle.type as 'public' | 'private',
          roundCount: typeof battle.round_count === 'number' && battle.round_count >= 0 ? battle.round_count : 0,
          timePerTurn: battle.time_per_turn
        }));
        
        setBattles(formattedBattles);
      } catch (error) {
        console.error('Error fetching battles:', error);
        toast.error("Failed to load battles");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBattles();
    
    // Set up real-time subscription for new battles
    const channel = supabase
      .channel('battle_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battles' }, 
        () => {
          // Just refetch all battles when any changes occur
          fetchBattles();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const handleSearch = (results: BattleData[]) => {
    setBattles(results);
  };
  
  return (
    <div className="min-h-screen bg-night flex flex-col">
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Battle Lobby</h1>
          <p className="text-muted-foreground">Find a battle to join or spectate, or create your own.</p>
        </div>
        
        <div className="flex flex-col gap-8">
          {/* Search and Create Section */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <BattleSearch onSearch={handleSearch} />
            </div>
            <div className="flex gap-4">
              <Button asChild className="gap-2 bg-primary text-black border-2 border-black hover:bg-primary/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 transition-all">
                <Link to="/battles/new">
                  <Plus className="h-4 w-4" />
                  Create Battle
                </Link>
              </Button>
              <JoinPrivateBattleDialog />
            </div>
          </div>
          
          {/* Battle Types Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid grid-cols-4 max-w-md bg-blue border-2 border-black">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">All</TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">Active</TabsTrigger>
              <TabsTrigger value="waiting" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">Waiting</TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              {loading ? (
                  <Loader size="large" variant="colorful" />
                 
              ) : battles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {battles.map((battle) => (
                    <BattleCard key={battle.id} {...battle} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-secondary border-2 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-black font-bold mb-4">No battles found</p>
                  <Button asChild className="gap-2 bg-primary text-black border-2 border-black hover:bg-primary/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 transition-all">
                    <Link to="/battles/new">
                      <Plus className="h-4 w-4" />
                      Create a Battle!
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="active" className="space-y-6">
              {loading ? (
                <div className="flex justify-center items-center py-12"><Loader size="large" variant="colorful" /></div>
              ) : battles.filter(battle => battle.status === 'active').length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {battles.filter(battle => battle.status === 'active').map((battle) => (
                    <BattleCard key={battle.id} {...battle} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-secondary border-2 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-black font-bold">No active battles!</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="waiting" className="space-y-6">
              {loading ? (
                <div className="flex justify-center items-center py-12"><Loader size="large" variant="colorful" /></div>
              ) : battles.filter(battle => battle.status === 'waiting').length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {battles.filter(battle => battle.status === 'waiting').map((battle) => (
                    <BattleCard key={battle.id} {...battle} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-secondary border-2 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-black font-bold">No battles waiting for players!</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader size="large" variant="colorful" />
                  </div>
              ) : battles.filter(battle => battle.status === 'completed').length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {battles.filter(battle => battle.status === 'completed').map((battle) => (
                    <BattleCard key={battle.id} {...battle} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-secondary border-2 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-black font-bold">No completed battle!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default BattleLobby;
