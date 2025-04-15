
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Copy, Users, Lock, LockOpen, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const NewBattle = () => {
  return (
    <div className="min-h-screen bg-night flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Battle</h1>
          <p className="text-muted-foreground">Set up your roast battle parameters</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="flame-card p-6">
              <form className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Battle Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter a catchy title..."
                      className="border-night-700 focus-visible:ring-flame-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Battle Type</Label>
                    <RadioGroup defaultValue="public" className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <RadioGroup defaultValue="3" className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <RadioGroup defaultValue="180" className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <Switch id="spectators" defaultChecked className="data-[state=checked]:bg-flame-500" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-match">Quick Match</Label>
                      <p className="text-sm text-muted-foreground">
                        Auto pair with a random opponent
                      </p>
                    </div>
                    <Switch id="auto-match" className="data-[state=checked]:bg-flame-500" />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button asChild className="gap-2 bg-gradient-flame hover:opacity-90">
                    <Link to="/battle/waiting">
                      Create Battle
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </form>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="flame-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-flame-500" />
                Invite Opponents
              </h3>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Share this link with people you want to battle with.
                </p>
                
                <div className="flex items-center gap-2">
                  <Input
                    value="https://getroasted.app/join/a1b2c3d4"
                    readOnly
                    className="border-night-700"
                  />
                  <Button variant="outline" size="icon" className="border-night-700">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full border-night-700">
                    Invite from Contacts
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="flame-card p-6">
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
