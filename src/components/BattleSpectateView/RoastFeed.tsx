import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Roast {
  id: string;
  content: string;
  user_id: string;
  round_number: number;
  created_at: string;
}

interface Profile {
  username: string;
  avatar_url: string | null;
}

interface RoastFeedProps {
  roasts: Roast[];
  getParticipantById: (userId: string) => Profile;
}

const RoastFeed: React.FC<RoastFeedProps> = ({ roasts, getParticipantById }) => {
  return (
    <div className="space-y-6">
      {roasts.length > 0 ? (
        roasts.map((roast) => {
          const profile = getParticipantById(roast.user_id);
          return (
            <div key={roast.id}>
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback>
                    {profile.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-semibold">{profile.username}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Round {roast.round_number}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(roast.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 p-3 bg-night-800 rounded-md">
                    {roast.content}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Flame className="h-4 w-4 mr-1" />
                      <span>Fire</span>
                    </Button>
                  </div>
                </div>
              </div>
              <Separator className="my-4 bg-night-700" />
            </div>
          );
        })
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No roasts yet. The battle will begin soon!</p>
        </div>
      )}
    </div>
  );
};

export default RoastFeed;
