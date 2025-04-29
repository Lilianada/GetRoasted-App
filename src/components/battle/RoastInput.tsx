
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useBattleContext } from '@/context/BattleContext';

interface RoastInputProps {
  className?: string;
}

const RoastInput: React.FC<RoastInputProps> = ({ className }) => {
  const [roastInput, setRoastInput] = useState("");
  const { isSpectator, isPlayerTurn, handleSendRoast } = useBattleContext();

  const onSendRoast = async () => {
    if (roastInput.trim() === "") return;
    await handleSendRoast(roastInput);
    setRoastInput("");
  };

  return (
    <div className={className}>
      <Textarea
        value={roastInput}
        onChange={(e) => setRoastInput(e.target.value)}
        placeholder={
          isSpectator
            ? "You are in spectator mode"
            : isPlayerTurn()
            ? "Type your roast..."
            : "Waiting for your turn..."
        }
        className="min-h-[100px] bg-white text-black"
        disabled={isSpectator || !isPlayerTurn()}
      />

      <div className="flex justify-end mt-2">
        <Button
          onClick={onSendRoast}
          disabled={!roastInput.trim() || isSpectator || !isPlayerTurn()}
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          Send Roast
        </Button>
      </div>
    </div>
  );
};

export default RoastInput;
