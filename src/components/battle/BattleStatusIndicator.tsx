
import React from 'react';
import { Clock, Flame, Users } from 'lucide-react';

interface BattleStatusIndicatorProps {
  status: string;
  participantsCount: number;
}

const BattleStatusIndicator = ({ status, participantsCount }: BattleStatusIndicatorProps) => {
  switch (status) {
    case 'waiting':
      return (
        <div className="flex items-center gap-2 text-yellow-500">
          <Clock className="h-4 w-4" />
          <span>Waiting {participantsCount < 2 ? 'for opponent' : 'to start'}</span>
        </div>
      );
    case 'active':
      return (
        <div className="flex items-center gap-2 text-green-500">
          <Flame className="h-4 w-4" />
          <span>In Progress</span>
        </div>
      );
    case 'completed':
      return (
        <div className="flex items-center gap-2 text-blue-500">
          <Users className="h-4 w-4" />
          <span>Completed</span>
        </div>
      );
    default:
      return <span>{status}</span>;
  }
};

export default BattleStatusIndicator;
