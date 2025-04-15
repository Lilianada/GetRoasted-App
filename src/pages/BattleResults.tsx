
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Crown, 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Twitter, 
  Facebook, 
  Link as LinkIcon
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Mock data - would be fetched from API
const MOCK_RESULTS = {
  battleId: "battle-12345",
  title: "Sunday Night Flamewar",
  participants: [
    { 
      id: "user-1", 
      name: "FlameKing", 
      avatar: undefined,
      isWinner: true,
      scores: {
        creativity: 4.2,
        humor: 4.8,
        savagery: 3.9,
        total: 22.5
      },
      bestRoast: "I've seen better code written by a cat walking across a keyboard. Your functions are so nested, they need a family tree!"
    },
    { 
      id: "user-2", 
      name: "RoastMaster", 
      avatar: undefined,
      isWinner: false,
      scores: {
        creativity: 3.8,
        humor: 4.0,
        savagery: 4.2,
        total: 19.8
      },
      bestRoast: "Your jokes are like your commit history - shallow and lacking substance. Even your IDE auto-complete suggests better punchlines."
    }
  ],
  roundCount: 3,
  spectatorCount: 42,
  voteCount: 38,
  completedAt: "2023-06-15T14:30:00Z"
};

const BattleResults = () => {
  const { participants, title, roundCount, spectatorCount, voteCount } = MOCK_RESULTS;
  const winner = participants.find(p => p.isWinner);
  const loser = participants.find(p => !p.isWinner);
  
  if (!winner || !loser) return null;
  
  return (
    <div className="min-h-screen bg-night flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-8">
        {/* Hero results section */}
        <Card className="flame-card p-6 md:p-8 mb-8">
          <div className="text-center mb-8">
            <Badge className="bg-flame-500 text-white mb-4">Battle Complete</Badge>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground">
              {roundCount} rounds • {spectatorCount} spectators • {voteCount} votes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Winner */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-flame-500 ring-4 ring-flame-500/20">
                  <AvatarImage src={winner.avatar} alt={winner.name} />
                  <AvatarFallback className="bg-night-700 text-flame-500 text-2xl">
                    {winner.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-4 right-0 transform translate-x-1/4 p-1 rounded-full bg-flame-500 text-white">
                  <Crown className="h-6 w-6 fill-current" />
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold">{winner.name}</h2>
                <p className="text-flame-500 font-bold text-lg">Winner</p>
              </div>
              
              <div className="space-y-2 w-full max-w-xs">
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-1">
                    <Star className="h-4 w-4 text-flame-500" />
                    Total Score
                  </span>
                  <span className="font-mono font-bold">{winner.scores.total.toFixed(1)}</span>
                </div>
                <Progress value={100} className="h-2.5 bg-night-700">
                  <div className="h-full bg-gradient-flame rounded-full" />
                </Progress>
              </div>
            </div>
            
            {/* Loser */}
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24 border-2 border-night-700">
                <AvatarImage src={loser.avatar} alt={loser.name} />
                <AvatarFallback className="bg-night-800 text-night-400 text-2xl">
                  {loser.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-xl font-bold">{loser.name}</h2>
                <p className="text-muted-foreground">Runner Up</p>
              </div>
              
              <div className="space-y-2 w-full max-w-xs">
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-1">
                    <Star className="h-4 w-4 text-night-400" />
                    Total Score
                  </span>
                  <span className="font-mono font-bold text-night-400">{loser.scores.total.toFixed(1)}</span>
                </div>
                <Progress 
                  value={(loser.scores.total / winner.scores.total) * 100} 
                  className="h-2.5 bg-night-700"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button asChild className="gap-2 bg-gradient-flame hover:opacity-90">
              <Link to={`/battle/${MOCK_RESULTS.battleId}`}>
                <MessageSquare className="h-4 w-4" />
                View Full Battle
              </Link>
            </Button>
          </div>
        </Card>
        
        {/* Detailed scores */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold">Best Roasts</h2>
            
            <Card className="flame-card p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-flame-500">
                    <AvatarImage src={winner.avatar} alt={winner.name} />
                    <AvatarFallback className="bg-night-700 text-flame-500">
                      {winner.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{winner.name}</span>
                      <Badge variant="outline" className="bg-flame-500/20 text-flame-500 border-flame-500/30">
                        Winner
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Most popular roast</p>
                  </div>
                </div>
                
                <blockquote className="border-l-2 border-flame-500 pl-4 italic">
                  "{winner.bestRoast}"
                </blockquote>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-flame-500">
                    <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                    <span>24</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-flame-500">
                    <Share2 className="h-3.5 w-3.5 mr-1" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="flame-card p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={loser.avatar} alt={loser.name} />
                    <AvatarFallback className="bg-night-800 text-night-400">
                      {loser.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <span className="font-semibold">{loser.name}</span>
                    <p className="text-xs text-muted-foreground">Best comeback</p>
                  </div>
                </div>
                
                <blockquote className="border-l-2 border-night-700 pl-4 italic">
                  "{loser.bestRoast}"
                </blockquote>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-flame-500">
                    <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                    <span>18</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-flame-500">
                    <Share2 className="h-3.5 w-3.5 mr-1" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Score Breakdown</h2>
            
            <Card className="flame-card p-6">
              <h3 className="font-semibold mb-4">Judging Categories</h3>
              
              <div className="space-y-6">
                {/* Creativity */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Creativity</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono text-flame-500">{winner.scores.creativity.toFixed(1)}</span>
                      <span className="text-sm font-mono text-night-400">{loser.scores.creativity.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-night-700 rounded-full flex overflow-hidden">
                    <div className="bg-gradient-flame h-full" style={{ width: `${(winner.scores.creativity / 5) * 50}%` }} />
                    <div className="bg-night-600 h-full" style={{ width: `${(loser.scores.creativity / 5) * 50}%` }} />
                  </div>
                </div>
                
                {/* Humor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Humor</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono text-flame-500">{winner.scores.humor.toFixed(1)}</span>
                      <span className="text-sm font-mono text-night-400">{loser.scores.humor.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-night-700 rounded-full flex overflow-hidden">
                    <div className="bg-gradient-flame h-full" style={{ width: `${(winner.scores.humor / 5) * 50}%` }} />
                    <div className="bg-night-600 h-full" style={{ width: `${(loser.scores.humor / 5) * 50}%` }} />
                  </div>
                </div>
                
                {/* Savagery */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Savagery</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono text-flame-500">{winner.scores.savagery.toFixed(1)}</span>
                      <span className="text-sm font-mono text-night-400">{loser.scores.savagery.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-night-700 rounded-full flex overflow-hidden">
                    <div className="bg-gradient-flame h-full" style={{ width: `${(winner.scores.savagery / 5) * 50}%` }} />
                    <div className="bg-night-600 h-full" style={{ width: `${(loser.scores.savagery / 5) * 50}%` }} />
                  </div>
                </div>
              </div>
              
              <div className="pt-6 space-y-4">
                <h3 className="font-semibold">Share Results</h3>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="border-night-700 gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="border-night-700 gap-2">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="border-night-700 gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="text-center">
          <Button asChild className="gap-2 bg-gradient-flame hover:opacity-90">
            <Link to="/battle/new">
              Start a New Battle
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default BattleResults;
