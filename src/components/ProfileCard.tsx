
import React from "react";
import Loader from "@/components/ui/loader";

interface ProfileCardProps {
  loading: boolean;
  avatarUrl?: string;
  username: string;
  bio?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  loading,
  avatarUrl,
  username,
  bio
}) => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow via-purple to-coral opacity-70 blur-lg group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      <div className="bg-gradient-to-br from-night-800 to-night-900 border-2 border-night-600 shadow-neo-lg rounded-xl px-8 py-6 flex flex-col items-center relative overflow-hidden transition-all duration-300 group-hover:translate-y-[-4px]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow to-coral"></div>
        
        {loading ? (
          <Loader size="large" variant="colorful" className="my-8"/>
        ) : (
          <>
            <div className="w-28 h-28 rounded-full border-4 border-yellow/20 shadow-lg overflow-hidden mb-4 bg-night-700 relative">
              <img
                src={avatarUrl || "/placeholder.svg"}
                alt={username}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="text-2xl font-black text-white mb-2">{username}</div>
            {bio && (
              <div className="text-base text-night-200 font-medium text-center mb-2 max-w-[90%]">{bio}</div>
            )}
            {!bio && (
              <div className="text-sm text-night-400 italic text-center">No bio provided yet</div>
            )}
            
            <div className="mt-4 w-full pt-4 border-t border-night-700">
              <div className="flex justify-center gap-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">0</div>
                  <div className="text-xs text-night-400">Battles</div>
                </div>
                <div className="h-10 w-px bg-night-700"></div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">0</div>
                  <div className="text-xs text-night-400">Wins</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
