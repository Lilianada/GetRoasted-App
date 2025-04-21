
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, LockOpen } from "lucide-react";
import { useNewBattleForm } from "@/hooks/useNewBattleForm";

export const BattleCreationForm = () => {
  const {
    isCreating,
    title, setTitle,
    battleType, setBattleType,
    roundCount, setRoundCount,
    timePerTurn, setTimePerTurn,
    allowSpectators, setAllowSpectators,
    quickMatch, setQuickMatch,
    handleCreateBattle
  } = useNewBattleForm();

  return (
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
                  Private
                  <span className="text-xs text-muted-foreground">
                    (Invite only)
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <BattleRoundsSelection roundCount={roundCount} setRoundCount={setRoundCount} />
          <BattleTimeSelection timePerTurn={timePerTurn} setTimePerTurn={setTimePerTurn} />
        </div>
        
        <BattleSettings 
          allowSpectators={allowSpectators}
          setAllowSpectators={setAllowSpectators}
          quickMatch={quickMatch}
          setQuickMatch={setQuickMatch}
        />
        
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
  );
};
