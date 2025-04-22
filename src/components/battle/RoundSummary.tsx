
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { useState, useEffect } from "react";

interface RoundSummaryProps {
  roundNumber: number;
  totalRounds: number;
  participants: {
    id: string;
    username: string;
    avatar_url?: string;
  }[];
  onNextRound?: () => void;
}

const RoundSummary = ({ 
  roundNumber,
  totalRounds,
  participants,
  onNextRound
}: RoundSummaryProps) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (onNextRound) {
      onNextRound();
    }
  }, [countdown, onNextRound]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center border-b border-night-800">
        <CardTitle className="flex items-center justify-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Round {roundNumber} Complete
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Round Statistics</h3>
            <Badge variant="outline">
              Round {roundNumber}/{totalRounds}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {participants.map((participant) => (
              <div key={participant.id} className="p-4 border border-night-800 rounded-lg">
                <h4 className="font-medium">{participant.username}</h4>
                {/* Add more stats here as needed */}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Next round starting in <span className="text-flame-500">{countdown}</span> seconds
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoundSummary;
