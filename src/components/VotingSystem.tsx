
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
    <Card className="bg-[#C5B4F0] border-2 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="border-b-2 border-black">
        <CardTitle className="flex items-center gap-2 text-black">
          <Trophy className="h-5 w-5 text-[#F8C537]" />
          Cast Your Vote
        </CardTitle>
        <CardDescription className="text-black/70 font-medium">Who was the best roaster in this battle?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {options.map((option) => (
          <div 
            key={option.id} 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all transform hover:-translate-y-1 hover:translate-x-1 ${
              selectedWinner === option.id 
                ? 'border-black bg-[#F8C537] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                : 'border-black bg-[#FFB4A8] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
            }`}
            onClick={() => setSelectedWinner(option.id)}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-black">
                <AvatarImage src={option.avatar} alt={option.name} />
                <AvatarFallback className="bg-[#A6C7F7] text-black font-bold">
                  {option.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-bold text-black">{option.name}</h3>
                <p className="text-xs text-black/70">Tap to select</p>
              </div>
              
              <div className="flex items-center">
                {selectedWinner === option.id && (
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className="h-4 w-4 text-black fill-black" 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="border-t-2 border-black pt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedWinner} 
          className="w-full bg-[#F8C537] text-black border-2 border-black hover:bg-[#F8C537]/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 transition-all transform font-bold text-lg h-12"
        >
          Submit Vote
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VotingSystem;
