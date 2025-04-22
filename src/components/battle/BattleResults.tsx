
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Share2, RotateCcw, Home, Award, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";

interface BattleResultsProps {
  winner: {
    id: string;
    username: string;
    avatar_url?: string;
    score?: number;
  };
  participants: {
    id: string;
    username: string;
    avatar_url?: string;
    score?: number;
  }[];
  onRematch?: () => void;
}

const BattleResults = ({ winner, participants, onRematch }: BattleResultsProps) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Sort participants by score
  const sortedParticipants = [...participants].sort((a, b) => 
    (b.score || 0) - (a.score || 0)
  );

  useEffect(() => {
    // Show confetti animation when results are first displayed
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Roast Battle Results",
        text: `Check out this epic roast battle! ${winner.username} emerged victorious with ${winner.score} points!`,
        url: window.location.href
      });
    } catch (err) {
      console.log("Share failed", err);
      // Fallback for browsers that don't support navigator.share
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Battle link copied to clipboard!");
      } catch (clipboardErr) {
        toast.error("Couldn't share or copy link");
      }
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center border-b border-night-800">
        <CardTitle className="flex items-center justify-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Battle Complete!
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              {winner.username} Wins!
            </h3>
            <p className="text-muted-foreground">
              Final Score: <span className="font-bold text-flame-500">{winner.score || 0}</span> points
            </p>
          </div>

          <div className="space-y-4">
            {sortedParticipants.map((participant, index) => (
              <div 
                key={participant.id} 
                className={`p-4 rounded-lg ${
                  participant.id === winner.id 
                    ? "border-2 border-yellow-500/50 bg-yellow-500/5" 
                    : "border border-night-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="font-bold text-xl text-muted-foreground">{index + 1}</div>
                  
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={participant.avatar_url} alt={participant.username} />
                    <AvatarFallback>
                      {participant.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h4 className="font-medium">{participant.username}</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        Score: <span className="font-bold">{participant.score || 0}</span>
                      </p>
                      
                      {participant.id === winner.id && (
                        <div className="flex ml-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className="h-3 w-3 text-yellow-500 fill-yellow-500"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <Progress 
                    value={participant.score} 
                    max={Math.max(...participants.map(p => p.score || 0)) || 100} 
                    className="h-2" 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button onClick={onRematch} className="gap-2 bg-flame-500 hover:bg-flame-600">
              <RotateCcw className="h-4 w-4" />
              Rematch
            </Button>
            <Button onClick={handleShare} variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button onClick={() => navigate('/battles')} variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Back to Lobby
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BattleResults;
