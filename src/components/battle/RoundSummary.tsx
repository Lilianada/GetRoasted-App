
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface RoundSummaryProps {
  roundNumber: number;
  totalRounds: number;
  participants: {
    id: string;
    username: string;
    avatar_url?: string;
    score?: number;
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
  const [showScore, setShowScore] = useState(false);

  // Sort participants by score
  const sortedParticipants = [...participants].sort((a, b) => 
    (b.score || 0) - (a.score || 0)
  );
  
  const roundLeader = sortedParticipants.length > 0 ? sortedParticipants[0] : null;

  useEffect(() => {
    // First show the scores with animation
    const scoreTimer = setTimeout(() => {
      setShowScore(true);
    }, 500);
    
    // Then start countdown
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => {
        clearTimeout(timer);
        clearTimeout(scoreTimer);
      };
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
            <h3 className="text-lg font-semibold">Current Standings</h3>
            <Badge variant="outline">
              Round {roundNumber}/{totalRounds}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {sortedParticipants.map((participant, index) => (
              <div 
                key={participant.id} 
                className={`p-4 rounded-lg transition-all duration-300 ${
                  index === 0 
                    ? 'border-2 border-yellow-500 bg-yellow-500/10' 
                    : 'border border-night-800'
                } ${showScore ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="font-bold text-xl text-muted-foreground">{index + 1}</div>
                  
                  <Avatar className="h-12 w-12 border-2 border-night-700">
                    {participant.avatar_url && (
                      <AvatarImage src={participant.avatar_url} alt={participant.username} />
                    )}
                    <AvatarFallback className="bg-night-700 text-yellow-500">
                      {participant.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">{participant.username}</h4>
                    <div className="flex items-center gap-1">
                      <div className="text-xl font-bold">{participant.score || 0}</div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>
                  
                  {index === 0 && (
                    <div className="flex">
                      {[1, 2, 3].map((star) => (
                        <Star key={star} 
                          className={`h-5 w-5 ${
                            star <= (roundNumber <= 3 ? roundNumber : 3) 
                              ? 'text-yellow-500 fill-yellow-500' 
                              : 'text-night-500'
                          }`} 
                        />
                      ))}
                    </div>
                  )}
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

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Next round starting in <span className="text-flame-500 font-bold">{countdown}</span> seconds
            </p>
            <Button 
              onClick={onNextRound} 
              className="bg-flame-500 hover:bg-flame-600"
            >
              Continue to Round {roundNumber + 1}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoundSummary;
