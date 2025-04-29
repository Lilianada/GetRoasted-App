
import React from 'react';
import { useBattleContext } from '@/context/BattleContext';

interface BattleTurnIndicatorProps {
  className?: string;
}

const BattleTurnIndicator: React.FC<BattleTurnIndicatorProps> = ({ className }) => {
  const { participants, currentTurnUserId } = useBattleContext();
  
  const currentTurnPlayer = participants.find(p => p.id === currentTurnUserId);

  if (!currentTurnPlayer) return null;

  return (
    <div className={`bg-secondary/20 p-2 rounded text-center ${className}`}>
      <span className="text-sm">
        Current Turn: <span className="font-semibold">{currentTurnPlayer.username}</span>
      </span>
    </div>
  );
};

export default BattleTurnIndicator;
