
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Props for battle settings
interface BattleSettingsProps {
  allowSpectators: boolean;
  setAllowSpectators: (v: boolean) => void;
}

/**
 * Battle settings component
 * 
 * Allows users to configure battle settings such as allowing spectators
 */
export const BattleSettings: React.FC<BattleSettingsProps> = ({ allowSpectators, setAllowSpectators }) => {
  return (
    <div className="space-y-4">
      {/* Allow spectators setting */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="spectators" aria-label="Allow spectators toggle">Allow Spectators</Label>
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
    </div>
  );
};
