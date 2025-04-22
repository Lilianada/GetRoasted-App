
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Share2, RotateCcw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BattleResultsProps {
  winner: {
    id: string;
    username: string;
    avatar_url?: string;
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

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Roast Battle Results",
        text: `Check out this epic roast battle! ${winner.username} emerged victorious!`,
        url: window.location.href
      });
    } catch (err) {
      console.log("Share failed", err);
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
            <h3 className="text-2xl font-bold mb-2">
              {winner.username} Wins!
            </h3>
            <p className="text-muted-foreground">
              Congratulations on an epic battle!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {participants.map((participant) => (
              <div 
                key={participant.id} 
                className={`p-4 rounded-lg ${
                  participant.id === winner.id 
                    ? "border-2 border-yellow-500/50 bg-yellow-500/5" 
                    : "border border-night-800"
                }`}
              >
                <h4 className="font-medium">{participant.username}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Score: {participant.score || 0}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button onClick={onRematch} className="gap-2">
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
