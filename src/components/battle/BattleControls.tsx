
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useBattleContext } from '@/context/BattleContext';

interface BattleControlsProps {
  isSpectator: boolean;
  showChat: boolean;
  setShowChat: (value: boolean) => void;
}

const BattleControls: React.FC<BattleControlsProps> = ({
  isSpectator,
  showChat,
  setShowChat
}) => {
  return (
    <div className="flex justify-between">
      {isSpectator && (
        <Button
          variant="outline"
          onClick={() => setShowChat(!showChat)}
          className="gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          {showChat ? 'Hide Chat' : 'Show Chat'}
        </Button>
      )}
    </div>
  );
};

export default BattleControls;
