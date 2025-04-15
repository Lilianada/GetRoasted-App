
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import {
  Flame,
  Snowflake,
  Skull,
  Clock,
  ChevronRight,
  MessageSquare,
  Users,
  ThumbsUp,
  Send,
  Mic,
  MicOff,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import NavBar from "@/components/NavBar";

// Mock data for the battle
const battleData = {
  id: "battle-123",
  status: "active", // active, waiting, completed
  type: "quick",
  round: 2,
  maxRounds: 3,
  players: [
    {
      id: "player1",
      username: "FlameThrow3r",
      avatar: "",
      status: "active",
      score: 8.7,
      isCurrentTurn: true
    },
    {
      id: "player2",
      username: "RoastMaster99",
      avatar: "",
      status: "waiting",
      score: 8.2,
      isCurrentTurn: false
    }
  ],
  spectatorCount: 12,
  timeRemaining: 120, // in seconds
  totalTime: 180, // in seconds
  roasts: [
    {
      id: "roast1",
      userId: "player1",
      round: 1,
      text: "Your comebacks are so weak they need life support just to make it to the punchline. Did you get your material from a 'Roasting for Dummies' book that was missing half its pages?",
      timestamp: "2025-04-15T14:30:00Z",
      reactions: { fire: 5, ice: 1, skull: 2 }
    },
    {
      id: "roast2",
      userId: "player2",
      round: 1,
      text: "You call yourself FlameThrow3r, but the only thing you're throwing is your dignity out the window. Your roasts are like non-alcoholic beer: all the disappointment with none of the buzz.",
      timestamp: "2025-04-15T14:32:00Z",
      reactions: { fire: 8, ice: 2, skull: 3 }
    },
    {
      id: "roast3",
      userId: "player1",
      round: 2,
      text: "I'm not surprised your favorite drink is non-alcoholic beer - it matches your personality. Trying to appear interesting, but ultimately just flat and forgettable.",
      timestamp: "2025-04-15T14:35:00Z",
      reactions: { fire: 7, ice: 1, skull: 1 }
    }
  ],
  spectatorChat: [
    {
      id: "chat1",
      userId: "spec1",
      username: "WittyObserver",
      avatar: "",
      text: "These roasts are getting good!",
      timestamp: "2025-04-15T14:31:30Z"
    },
    {
      id: "chat2",
      userId: "spec2",
      username: "LaughingHard",
      avatar: "",
      text: "RoastMaster99 is bringing the heat 🔥",
      timestamp: "2025-04-15T14:33:15Z"
    },
    {
      id: "chat3",
      userId: "spec3",
      username: "ComebackKid",
      avatar: "",
      text: "That last one was brutal! 💀",
      timestamp: "2025-04-15T14:36:00Z"
    }
  ]
};

const Battle = () => {
  const [roastInput, setRoastInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(battleData.timeRemaining);
  const [isSpectator, setIsSpectator] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // In a real app, this would be determined by authentication
  const currentUserId = battleData.players[0].id;
  
  const handleSendRoast = () => {
    if (roastInput.trim() === "") return;
    
    toast.success("Roast submitted!");
    setRoastInput("");
  };
  
  const handleSendChat = () => {
    if (chatInput.trim() === "") return;
    
    toast.success("Message sent!");
    setChatInput("");
  };
  
  const handleReaction = (roastId: string, reaction: string) => {
    toast(`You reacted with ${reaction}`, {
      duration: 1500,
    });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  
  const timePercentage = (timeRemaining / battleData.totalTime) * 100;
  
  const isPlayerTurn = () => {
    const currentPlayer = battleData.players.find(player => player.id === currentUserId);
    return currentPlayer?.isCurrentTurn;
  };

  return (
    <div className="min-h-screen bg-night flex flex-col">
      <NavBar />
      
      <main className="container flex-1 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Battle Arena */}
          <div className="flex-1">
            <Card className="p-4 flame-card border-night-700">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-flame-600/20 text-flame-500">
                      Round {battleData.round}/{battleData.maxRounds}
                    </Badge>
                    <Badge variant="outline" className="bg-night-700">
                      <Users className="h-3 w-3 mr-1" />
                      {battleData.spectatorCount} Spectators
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={timeRemaining < 30 ? "destructive" : "outline"} className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(timeRemaining)}
                    </Badge>
                    
                    {isSpectator ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-night-700 border-night-600"
                        onClick={() => setShowChat(!showChat)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                    ) : (
                      <Button 
                        variant={isPlayerTurn() ? "default" : "outline"}
                        size="sm" 
                        disabled={!isPlayerTurn()}
                      >
                        {isPlayerTurn() ? (
                          <>
                            <Mic className="h-4 w-4 mr-1" />
                            Your Turn
                          </>
                        ) : (
                          <>
                            <MicOff className="h-4 w-4 mr-1" />
                            Waiting
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                
                <Progress value={timePercentage} className="h-2" />
              </div>
              
              <div className="flex justify-between items-center mb-4">
                {battleData.players.map((player, index) => (
                  <div key={player.id} className={`flex ${index === 0 ? "flex-row" : "flex-row-reverse"} items-center gap-3`}>
                    <Avatar className={`h-12 w-12 border-2 ${player.isCurrentTurn ? "border-flame-500 animate-pulse" : "border-night-700"}`}>
                      <AvatarImage src={player.avatar} alt={player.username} />
                      <AvatarFallback className="bg-night-700 text-flame-500">
                        {player.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`text-${index === 0 ? "left" : "right"}`}>
                      <div className="font-medium">{player.username}</div>
                      <div className="text-xs text-muted-foreground">Score: {player.score}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 mb-6">
                {battleData.roasts.map((roast) => {
                  const player = battleData.players.find(p => p.id === roast.userId);
                  const isLeft = roast.userId === battleData.players[0].id;
                  
                  return (
                    <div key={roast.id} className={`flex ${isLeft ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[80%] flex flex-col ${isLeft ? "items-start" : "items-end"}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {isLeft ? (
                            <>
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-night-700 text-flame-500 text-xs">
                                  {player?.username.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {player?.username} • Round {roast.round}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-xs text-muted-foreground">
                                {player?.username} • Round {roast.round}
                              </span>
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-night-700 text-flame-500 text-xs">
                                  {player?.username.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </>
                          )}
                        </div>
                        
                        <div className={`p-3 rounded-lg ${
                          isLeft ? 
                          "bg-night-800 border border-night-700 rounded-tl-none" : 
                          "bg-flame-600/20 border border-flame-500/20 rounded-tr-none"
                        }`}>
                          <p>{roast.text}</p>
                        </div>
                        
                        <div className={`flex gap-2 mt-1 ${isLeft ? "" : "flex-row-reverse"}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-muted-foreground hover:text-flame-500"
                            onClick={() => handleReaction(roast.id, "fire")}
                          >
                            <Flame className="h-3.5 w-3.5 mr-1" />
                            <span className="text-xs">{roast.reactions.fire}</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-muted-foreground hover:text-blue-400"
                            onClick={() => handleReaction(roast.id, "ice")}
                          >
                            <Snowflake className="h-3.5 w-3.5 mr-1" />
                            <span className="text-xs">{roast.reactions.ice}</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-muted-foreground hover:text-amber-400"
                            onClick={() => handleReaction(roast.id, "skull")}
                          >
                            <Skull className="h-3.5 w-3.5 mr-1" />
                            <span className="text-xs">{roast.reactions.skull}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {!isSpectator && (
                <div className="relative">
                  <Textarea 
                    placeholder={isPlayerTurn() ? "Type your roast here..." : "Waiting for your turn..."}
                    className="min-h-[100px] border-night-700 focus-visible:ring-flame-500 pr-12"
                    value={roastInput}
                    onChange={(e) => setRoastInput(e.target.value)}
                    disabled={!isPlayerTurn()}
                  />
                  <Button 
                    size="icon" 
                    className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-flame-500 hover:bg-flame-600"
                    onClick={handleSendRoast}
                    disabled={!isPlayerTurn() || roastInput.trim() === ""}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
          </div>
          
          {/* Spectator Chat (visible on larger screens or when toggled on mobile) */}
          <div className={`w-full lg:w-80 ${showChat ? "block" : "hidden lg:block"}`}>
            <Card className="flame-card border-night-700 h-full">
              <div className="flex items-center justify-between p-3 border-b border-night-700">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-flame-500" />
                  <h2 className="font-medium">Spectator Chat</h2>
                </div>
                <Badge variant="outline" className="bg-night-700">
                  {battleData.spectatorCount}
                </Badge>
              </div>
              
              <div className="p-3 h-[500px] lg:h-[calc(100vh-350px)] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-3 mb-3">
                  {battleData.spectatorChat.map((message) => (
                    <div key={message.id} className="flex items-start gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-night-700 text-xs">
                          {message.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium">{message.username}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="bg-night-700 my-2" />
                
                <div className="relative">
                  <Input 
                    placeholder="Type a message..."
                    className="pr-10 border-night-700 focus-visible:ring-flame-500"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <Button 
                    size="icon" 
                    className="absolute right-1 top-1 h-6 w-6 rounded-full bg-flame-500 hover:bg-flame-600"
                    onClick={handleSendChat}
                    disabled={chatInput.trim() === ""}
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Battle;
