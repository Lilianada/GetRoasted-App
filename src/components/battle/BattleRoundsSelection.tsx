
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BattleRoundsSelectionProps {
  roundCount: string;
  setRoundCount: (value: string) => void;
}

export const BattleRoundsSelection = ({ roundCount, setRoundCount }: BattleRoundsSelectionProps) => {
  return (
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
  );
};
