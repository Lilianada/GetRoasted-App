
import React from "react";
import Loader from "@/components/ui/loader";

interface ProfileCardProps {
  loading: boolean;
  avatarUrl?: string;
  username: string;
  bio?: string;
  stats?: {
    battles: number;
    wins: number;
    winRate?: number;
    longestStreak?: number;
  };
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  loading,
  avatarUrl,
  username,
  bio,
  stats = { battles: 0, wins: 0 }
}) => {
  return (
    <div className="bg-secondary border-2 border-black shadow-neo rounded-xl px-8 py-6 flex flex-col items-center relative overflow-hidden transition-all duration-300 hover:translate-y-[-4px]">
      {loading ? (
        <Loader size="large" variant="colorful" className="my-8"/>
      ) : (
        <>
          <div className="w-28 h-28 rounded-full border-4 border-black shadow-lg overflow-hidden mb-4 bg-night-700 relative">
            <img
              src={avatarUrl || "/placeholder.svg"}
              alt={username}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>
          <div className="text-2xl font-black text-black mb-2">{username}</div>
          {bio && (
            <div className="text-base text-night-900 font-medium text-center mb-2 max-w-[90%]">{bio}</div>
          )}
          {!bio && (
            <div className="text-sm text-night-400 italic text-center">No bio provided yet</div>
          )}
          
          <div className="mt-4 w-full pt-4 border-t border-night-700">
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <div className="text-xl font-bold text-black">{stats.battles || 0}</div>
                <div className="text-xs text-night-400">Battles</div>
              </div>
              
              <div className="h-10 w-px bg-night-700"></div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-black">{stats.wins || 0}</div>
                <div className="text-xs text-night-400">Wins</div>
              </div>
              
              {stats.winRate !== undefined && (
                <>
                  <div className="h-10 w-px bg-night-700"></div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-black">{stats.winRate}%</div>
                    <div className="text-xs text-night-400">Win Rate</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileCard;
