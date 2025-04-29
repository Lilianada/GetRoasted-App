
import React from 'react';
import { VotingSystem } from './VotingSystem';
import { useBattleContext } from '@/context/BattleContext';

interface BattleVotingPanelProps {
  isSpectator: boolean;
  canVote: boolean;
  participants: any[];
  onVote: (userId: string) => Promise<void>;
  userVote: string | null;
}

const BattleVotingPanel: React.FC<BattleVotingPanelProps> = ({
  isSpectator,
  canVote,
  participants,
  onVote,
  userVote
}) => {
  if (!isSpectator || !canVote) return null;
  
  return (
    <div className="mt-6">
      <VotingSystem
        options={participants.map(p => ({
          id: p.id,
          name: p.username || 'Unknown Player',
          avatar: p.avatar_url
        }))}
        onVote={onVote}
        disabled={!canVote}
        votedFor={userVote || undefined}
      />
    </div>
  );
};

export default BattleVotingPanel;
