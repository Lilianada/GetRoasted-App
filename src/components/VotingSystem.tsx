
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Star, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface VotingOption {
  id: string;
  name: string;
  avatar?: string;
}

interface VotingSystemProps {
  options: VotingOption[];
  onVote: (scores: Record<string, { creativity: number; humor: number; savagery: number }>) => void;
}

const VotingSystem = ({ options, onVote }: VotingSystemProps) => {
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedWinner) return;
    
    // For backward compatibility, we still use the old scoring structure
    // even though we've simplified the UI
    const scores: Record<string, { creativity: number; humor: number; savagery: number }> = {};
    
    options.forEach((option) => {
      if (option.id === selectedWinner) {
        scores[option.id] = { creativity: 5, humor: 5, savagery: 5 };
      } else {
        scores[option.id] = { creativity: 3, humor: 3, savagery: 3 };
      }
    });
    
    onVote(scores);
  };

  return (
    <Card className="flame-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-flame-500" />
          Cast Your Vote
        </CardTitle>
        <CardDescription>Who was the best roaster in this battle?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {options.map((option) => (
          <div 
            key={option.id} 
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedWinner === option.id 
                ? 'border-flame-500 bg-flame-500/10' 
                : 'border-night-700 hover:border-flame-500/50'
            }`}
            onClick={() => setSelectedWinner(option.id)}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={option.avatar} alt={option.name} />
                <AvatarFallback className="bg-night-700 text-flame-500">
                  {option.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-medium">{option.name}</h3>
                <p className="text-xs text-muted-foreground">Tap to select</p>
              </div>
              
              <div className="flex items-center">
                {selectedWinner === option.id && (
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className="h-4 w-4 text-flame-500 fill-flame-500" 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedWinner} 
          className="w-full bg-gradient-flame hover:opacity-90"
        >
          Submit Vote
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VotingSystem;
