
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface BattleWaitingFooterProps {
  onBack: () => void;
  onEnterBattle: () => void;
  showEnterButton: boolean;
}

const BattleWaitingFooter = ({
  onBack,
  onEnterBattle,
  showEnterButton
}: BattleWaitingFooterProps) => {
  return (
    <div className="flex justify-between border-t border-night-800 pt-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Lobby
      </Button>
      
      {showEnterButton && (
        <Button
          className="bg-flame-500 hover:bg-flame-600 text-white gap-2"
          onClick={onEnterBattle}
        >
          Enter Battle Room
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default BattleWaitingFooter;
