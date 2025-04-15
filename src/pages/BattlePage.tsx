
import { useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import RoastInput from "@/components/RoastInput";
import BattleTimer from "@/components/BattleTimer";
import VotingSystem from "@/components/VotingSystem";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, MessageSquare, ThumbsUp, Share2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mocked data - would be fetched from API based on battleId
const MOCK_BATTLE = {
  id: "battle-1",
  title: "Sunday Night Flamewar",
  participants: [
    { id: "user-1", name: "FlameKing", avatar: undefined },
    { id: "user-2", name: "RoastMaster", avatar: undefined },
  ],
  spectatorCount: 24,
  status: 'active' as const,
  currentRound: 1,
  totalRounds: 3,
  currentTurn: "user-1",
  timeRemaining: 180,
  type: 'public' as const,
  messages: [
    {
      id: "msg-1",
      userId: "user-1",
      text: "I've seen better code written by a cat walking across a keyboard. Your functions are so nested, they need a family tree!",
      timestamp: new Date().toISOString(),
      likes: 5,
    },
    {
      id: "msg-2",
      userId: "user-2",
      text: "Your jokes are like your commit history - shallow and lacking substance. Even your IDE auto-complete suggests better punchlines.",
      timestamp: new Date().toISOString(),
      likes: 8,
    },
  ],
};

const BattlePage = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const [battle, setBattle] = useState(MOCK_BATTLE);
  const [showVoting, setShowVoting] = useState(false);
  const [message, setMessage] = useState("");
  
  const isMyTurn = true; // Would be determined by auth user ID comparison
  const isSpectator = true; // Would be determined by checking participant status
  
  const handleSendRoast = (text: string) => {
    console.log("Sending roast:", text);
    // Would send to backend and update battle state
    
    // Mock adding message to state
    setBattle((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: `msg-${prev.messages.length + 1}`,
          userId: isMyTurn ? prev.currentTurn : "spectator-123",
          text,
          timestamp: new Date().toISOString(),
          likes: 0,
        },
      ],
      // Switch turns in a real implementation
    }));
    setMessage("");
  };
  
  const handleLike = (messageId: string) => {
    // Would send to backend and update likes
    setBattle((prev) => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, likes: msg.likes + 1 } 
          : msg
      )
    }));
  };
  
  const handleTimeout = () => {
    console.log("Time's up!");
    // Would update turn in real implementation
  };
  
  const handleVote = (scores: Record<string, { creativity: number; humor: number; savagery: number }>) => {
    console.log("Vote submitted:", scores);
    // Would send to backend and update battle state
    setShowVoting(false);
  };

  return (
    <div className="min-h-screen bg-night flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{battle.title}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="outline" className="bg-flame-500/20 text-flame-500 border-flame-500/30">
              Round {battle.currentRound}/{battle.totalRounds}
            </Badge>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              <span>{battle.spectatorCount} watching</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{battle.messages.length} roasts</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Battle Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Battle Messages */}
            <div className="flame-card min-h-[400px] flex flex-col">
              <Tabs defaultValue="battle" className="flex-1 flex flex-col">
                <div className="px-4 pt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="battle">Battle</TabsTrigger>
                    <TabsTrigger value="spectator">Spectator Chat</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="battle" className="flex-1 flex flex-col p-4 pt-2 space-y-0">
                  <div className="flex-1 overflow-auto space-y-4">
                    {battle.messages.map((message) => {
                      const participant = battle.participants.find(p => p.id === message.userId);
                      const isCurrentUser = message.userId === battle.currentTurn;
                      
                      return (
                        <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex gap-3 max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                            <Avatar className="h-10 w-10 mt-1">
                              <AvatarImage src={participant?.avatar} alt={participant?.name} />
                              <AvatarFallback className="bg-night-700 text-flame-500">
                                {participant?.name.substring(0, 2).toUpperCase() || "SP"}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="space-y-1">
                              <div className={`flex items-center gap-2 ${isCurrentUser ? 'justify-end' : ''}`}>
                                <span className="text-sm font-semibold">{participant?.name || "Spectator"}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              
                              <div className={`p-3 rounded-lg ${
                                isCurrentUser 
                                  ? 'bg-flame-500 text-white' 
                                  : 'bg-night-800 border border-night-700'
                              }`}>
                                <p className="text-sm">{message.text}</p>
                              </div>
                              
                              <div className={`flex items-center gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 px-2 text-muted-foreground hover:text-flame-500"
                                  onClick={() => handleLike(message.id)}
                                >
                                  <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                                  <span>{message.likes}</span>
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 px-2 text-muted-foreground hover:text-flame-500"
                                >
                                  <Share2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
                
                <TabsContent value="spectator" className="flex-1 flex flex-col p-4">
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <p>Spectator chat will appear here...</p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="p-4 border-t border-night-800">
                <RoastInput 
                  onSubmit={handleSendRoast}
                  isDisabled={!isMyTurn && !isSpectator}
                  timeRemaining={isMyTurn ? battle.timeRemaining : undefined}
                  placeholder={isMyTurn ? "Type your roast..." : "You can only comment as a spectator..."}
                />
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Timer */}
            {isMyTurn && (
              <BattleTimer
                initialSeconds={180} // 3 minutes
                isActive={isMyTurn}
                onTimeout={handleTimeout}
              />
            )}
            
            {/* Participants */}
            <Card className="flame-card">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Users className="h-4 w-4 text-flame-500" />
                  Participants
                </h3>
                
                <div className="space-y-4">
                  {battle.participants.map((participant, index) => (
                    <div key={participant.id} className="flex items-center gap-3">
                      <Avatar className={`h-10 w-10 ${
                        battle.currentTurn === participant.id ? "ring-2 ring-flame-500" : ""
                      }`}>
                        <AvatarImage src={participant.avatar} alt={participant.name} />
                        <AvatarFallback className="bg-night-700 text-flame-500">
                          {participant.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{participant.name}</span>
                          {battle.currentTurn === participant.id && (
                            <Badge variant="outline" className="text-xs bg-flame-500/20 text-flame-500 border-flame-500/30">
                              Current Turn
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {index === 0 ? "Challenger" : "Opponent"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Voting Section */}
            {!showVoting ? (
              <Button 
                onClick={() => setShowVoting(true)}
                className="bg-gradient-flame hover:opacity-90"
              >
                Vote Now
              </Button>
            ) : (
              <VotingSystem 
                options={battle.participants} 
                onVote={handleVote} 
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BattlePage;
