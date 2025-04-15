
import NavBar from "@/components/NavBar";
import BattleCard from "@/components/BattleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Link as LinkIcon } from "lucide-react";

// Mock data - would be fetched from API
const MOCK_BATTLES = [
  {
    id: "battle-1",
    title: "Sunday Night Flamewar",
    participants: [
      { id: "user-1", name: "FlameKing", avatar: undefined },
      { id: "user-2", name: "RoastMaster", avatar: undefined },
    ],
    spectatorCount: 24,
    status: 'active' as const,
    timeRemaining: 120,
    type: 'public' as const,
    roundCount: 3,
  },
  {
    id: "battle-2",
    title: "Midnight Roast Session",
    participants: [
      { id: "user-3", name: "WittyBurn", avatar: undefined },
    ],
    spectatorCount: 5,
    status: 'waiting' as const,
    type: 'public' as const,
    roundCount: 3,
  },
  {
    id: "battle-3",
    title: "Pro Roasters Only",
    participants: [
      { id: "user-4", name: "SavageComedy", avatar: undefined },
      { id: "user-5", name: "FlameQueen", avatar: undefined },
      { id: "user-6", name: "RoastKing", avatar: undefined },
    ],
    spectatorCount: 42,
    status: 'completed' as const,
    type: 'private' as const,
    roundCount: 3,
  },
  {
    id: "battle-4",
    title: "Comedy Showdown",
    participants: [
      { id: "user-7", name: "JokeKing", avatar: undefined },
      { id: "user-8", name: "HumorQueen", avatar: undefined },
    ],
    spectatorCount: 18,
    status: 'active' as const,
    timeRemaining: 90,
    type: 'public' as const,
    roundCount: 3,
  },
  {
    id: "battle-5",
    title: "Roast Rookies",
    participants: [
      { id: "user-9", name: "NewGuy", avatar: undefined },
    ],
    spectatorCount: 3,
    status: 'waiting' as const,
    type: 'public' as const,
    roundCount: 2,
  },
  {
    id: "battle-6",
    title: "Late Night Laughs",
    participants: [
      { id: "user-10", name: "NightOwl", avatar: undefined },
      { id: "user-11", name: "StandupPro", avatar: undefined },
    ],
    spectatorCount: 15,
    status: 'active' as const,
    timeRemaining: 150,
    type: 'public' as const,
    roundCount: 3,
  },
];

const BattleLobby = () => {
  return (
    <div className="min-h-screen bg-night flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Battle Lobby</h1>
          <p className="text-muted-foreground">Find a battle to join or spectate, or create your own.</p>
        </div>
        
        <div className="flex flex-col gap-8">
          {/* Search and Create Section */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search battles..." 
                className="pl-9 border-night-700 focus-visible:ring-flame-500" 
              />
            </div>
            <div className="flex gap-4">
              <Button asChild className="gap-2 bg-gradient-flame hover:opacity-90">
                <a href="/battle/new">
                  <Plus className="h-4 w-4" />
                  Create Battle
                </a>
              </Button>
              <Button variant="outline" className="gap-2 border-night-700">
                <LinkIcon className="h-4 w-4" />
                Join Private
              </Button>
            </div>
          </div>
          
          {/* Battle Types Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid grid-cols-4 max-w-md">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="waiting">Waiting</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_BATTLES.map((battle) => (
                  <BattleCard key={battle.id} {...battle} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="active" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_BATTLES.filter(battle => battle.status === 'active').map((battle) => (
                  <BattleCard key={battle.id} {...battle} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="waiting" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_BATTLES.filter(battle => battle.status === 'waiting').map((battle) => (
                  <BattleCard key={battle.id} {...battle} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_BATTLES.filter(battle => battle.status === 'completed').map((battle) => (
                  <BattleCard key={battle.id} {...battle} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default BattleLobby;
