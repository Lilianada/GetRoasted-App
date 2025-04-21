
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
    <div className="mx-auto max-w-md">
      <div className="bg-gradient-to-br from-[#F8C537] via-[#A6C7F7] to-[#C5B4F0] border-2 border-black shadow-neo-lg rounded-xl px-8 py-6 flex flex-col items-center relative">
        {loading ? (
          <Loader size="large" variant="colorful" className="my-8"/>
        ) : (
          <>
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4 bg-night">
              <img
                src={avatarUrl || "/placeholder.svg"}
                alt={username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-2xl font-black gradient-text mb-1">{username}</div>
            {bio && (
              <div className="text-base text-night-800 font-medium text-center mb-2">{bio}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
