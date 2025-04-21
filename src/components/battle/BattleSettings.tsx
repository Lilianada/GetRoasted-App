
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface BattleSettingsProps {
  allowSpectators: boolean;
  setAllowSpectators: (value: boolean) => void;
  quickMatch: boolean;
  setQuickMatch: (value: boolean) => void;
}

export const BattleSettings = ({
  allowSpectators,
  setAllowSpectators,
  quickMatch,
  setQuickMatch
}: BattleSettingsProps) => {
  return (
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
  );
};
