
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BattleTimeSelectionProps {
  timePerTurn: string;
  setTimePerTurn: (value: string) => void;
}

export const BattleTimeSelection = ({ timePerTurn, setTimePerTurn }: BattleTimeSelectionProps) => {
  return (
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
            1 Minute
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="120" id="t2" className="text-flame-500" />
          <Label htmlFor="t2" className="flex items-center gap-2 cursor-pointer">
            2 Minutes
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="180" id="t3" className="text-flame-500" />
          <Label htmlFor="t3" className="flex items-center gap-2 cursor-pointer">
            3 Minutes
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
