import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Copy, Users, Lock, LockOpen, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";
import { useSettings } from "@/hooks/useSettings";

const NewBattle = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { playSound } = useSettings();
  const [isCreating, setIsCreating] = useState(false);
  
  const [title, setTitle] = useState("");
  const [battleType, setBattleType] = useState<'public' | 'private'>('public');
  const [roundCount, setRoundCount] = useState("3");
  const [timePerTurn, setTimePerTurn] = useState("180");
  const [allowSpectators, setAllowSpectators] = useState(true);
  const [quickMatch, setQuickMatch] = useState(false);
  
  const [battleId, setBattleId] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  
  const handleCreateBattle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create battles");
      return;
    }
    if (!title.trim()) {
      toast.error("Please provide a battle title");
      return;
    }
    setIsCreating(true);
    try {
      const { data: battleData, error: battleError } = await supabase
        .from('battles')
        .insert({
          title,
          type: battleType,
          round_count: parseInt(roundCount),
          time_per_turn: parseInt(timePerTurn),
          created_by: user.id,
          status: 'waiting',
          allow_spectators: allowSpectators
        })
        .select()
        .single();
      if (battleError) throw battleError;
      const { error: participantError } = await supabase
        .from('battle_participants')
        .insert({
          battle_id: battleData.id,
          user_id: user.id
        });
      if (participantError) throw participantError;
      toast.success("Battle created successfully!");
      playSound('success');
      navigate(`/battle/waiting/${battleData.id}`);
    } catch (error) {
      console.error('Error creating battle:', error);
      playSound('error');
      toast.error("Failed to create battle", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
      setIsCreating(false);
    }
  };
  
  const handleCopyLink = () => {
    if (!battleId) return;
    
    const inviteLink = `${window.location.origin}/battle/join/${battleId}`;
    navigator.clipboard.writeText(inviteLink);
    
    setShowCopied(true);
    toast.success("Invitation link copied!");
    
    setTimeout(() => {
      setShowCopied(false);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-night flex flex-col">
      <main className="container flex-1 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Battle</h1>
          <p className="text-muted-foreground">Set up your roast battle parameters</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-secondary border-2 border-black p-6">
              <form className="space-y-6" onSubmit={handleCreateBattle}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Battle Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter a catchy title..."
                      className="border-night-700 focus-visible:ring-flame-500"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Battle Type</Label>
                    <RadioGroup 
                      defaultValue="public" 
                      value={battleType}
                      onValueChange={(value) => setBattleType(value as 'public' | 'private')}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" className="text-flame-500" />
                        <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
                          <LockOpen className="h-4 w-4 text-flame-500" />
                          Public
                          <span className="text-xs text-muted-foreground">
                            (Anyone can join or watch)
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" className="text-flame-500" />
                        <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                          <Lock className="h-4 w-4 text-flame-500" />
                          Private
                          <span className="text-xs text-muted-foreground">
                            (Invite only)
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Number of Rounds</Label>
                    <RadioGroup 
                      value={roundCount}
                      onValueChange={setRoundCount}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="r1" className="text-flame-500" />
                        <Label htmlFor="r1" className="cursor-pointer">1 Round (Quick)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="r2" className="text-flame-500" />
                        <Label htmlFor="r2" className="cursor-pointer">2 Rounds</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="r3" className="text-flame-500" />
                        <Label htmlFor="r3" className="cursor-pointer">3 Rounds (Standard)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Time Per Turn</Label>
                    <RadioGroup 
                      value={timePerTurn}
                      onValueChange={setTimePerTurn}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="60" id="t1" className="text-flame-500" />
                        <Label htmlFor="t1" className="flex items-center gap-2 cursor-pointer">
                          <Clock className="h-4 w-4 text-flame-500" />
                          1 Minute
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="120" id="t2" className="text-flame-500" />
                        <Label htmlFor="t2" className="flex items-center gap-2 cursor-pointer">
                          <Clock className="h-4 w-4 text-flame-500" />
                          2 Minutes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="180" id="t3" className="text-flame-500" />
                        <Label htmlFor="t3" className="flex items-center gap-2 cursor-pointer">
                          <Clock className="h-4 w-4 text-flame-500" />
                          3 Minutes
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="spectators">Allow Spectators</Label>
                      <p className="text-sm text-muted-foreground">
                        Spectators can watch and vote
                      </p>
                    </div>
                    <Switch 
                      id="spectators" 
                      checked={allowSpectators}
                      onCheckedChange={setAllowSpectators}
                      className="data-[state=checked]:bg-flame-500" 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-match">Quick Match</Label>
                      <p className="text-sm text-muted-foreground">
                        Auto pair with a random opponent
                      </p>
                    </div>
                    <Switch 
                      id="auto-match" 
                      checked={quickMatch}
                      onCheckedChange={setQuickMatch}
                      className="data-[state=checked]:bg-flame-500" 
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    type="submit"
                    className="gap-2 bg-yellow hover:opacity-90"
                    disabled={isCreating}
                  >
                    {isCreating ? "Creating..." : "Create Battle"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-yellow border-2 border-black p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-flame-500" />
                Invite Opponents
              </h3>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  After creating your battle, you'll get a link to share with people you want to battle with.
                </p>
                
                {battleId && (
                  <>
                    <div className="flex items-center gap-2">
                      <Input
                        value={`${window.location.origin}/battle/join/${battleId}`}
                        readOnly
                        className="border-night-700"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="border-night-700" 
                        onClick={handleCopyLink}
                      >
                        {showCopied ? (
                          <span className="text-xs font-medium text-green-500">Copied!</span>
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
            
            <Card className="bg-yellow border-2 border-black p-6">
              <h3 className="text-lg font-semibold mb-4">Community Guidelines</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Roasts should be clever and funny, not cruel. Focus on wit, not personal attacks.
                </p>
                
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• No hate speech or discrimination</li>
                  <li>• No threatening language</li>
                  <li>• Keep it creative and humorous</li>
                  <li>• Don't share private information</li>
                </ul>
                
                <p className="text-sm text-muted-foreground">
                  Violating these guidelines may result in account suspension.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewBattle;
