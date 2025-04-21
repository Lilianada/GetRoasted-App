
import React from 'react';
import { Card } from '@/components/ui/card';
import Loader from '@/components/ui/loader';
import { Medal } from 'lucide-react';

interface LeaderboardPositionProps {
  loading: boolean;
  position?: number;
  totalPlayers?: number;
  topPercentage?: number;
}

const LeaderboardPosition = ({ loading, position, totalPlayers, topPercentage }: LeaderboardPositionProps) => {
  if (loading) {
    return (
      <Card className="p-6 bg-blue border-2 border-black text-black shadow-neo relative overflow-hidden">
        <div className="flex justify-center p-4">
          <Loader size="small" variant="colorful" />
        </div>
      </Card>
    );
  }

  if (!position) {
    return (
      <Card className="p-6 bg-blue border-2 border-black text-black shadow-neo relative overflow-hidden">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="font-bold">Not ranked yet</p>
          <p className="text-sm">Complete more battles to get ranked on the leaderboard</p>
        </div>
      </Card>
    );
  }

  let medalColor = "text-night-400";
  if (position === 1) medalColor = "text-yellow";
  else if (position === 2) medalColor = "text-night-300";
  else if (position === 3) medalColor = "text-amber-700";

  return (
    <Card className="p-6 bg-blue border-2 border-black text-black shadow-neo relative overflow-hidden">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-2 mb-2">
          <Medal className={`h-6 w-6 ${medalColor}`} />
          <span className="text-2xl font-bold">#{position}</span>
        </div>
        
        {totalPlayers && (
          <p className="text-sm">Out of {totalPlayers} players</p>
        )}
        
        {topPercentage && (
          <p className="text-sm font-medium mt-1">
            Top {topPercentage}%
          </p>
        )}
      </div>
    </Card>
  );
};

export default LeaderboardPosition;
