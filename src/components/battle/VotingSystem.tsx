
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";

interface VotingOption {
  id: string;
  name: string;
  avatar?: string;
}

interface VotingSystemProps {
  options: VotingOption[];
  onVote: (userId: string) => void;
  disabled?: boolean;
  votedFor?: string | null;
}

export const VotingSystem = ({ options, onVote, disabled, votedFor }: VotingSystemProps) => {
  const [selectedWinner, setSelectedWinner] = useState<string | null>(votedFor || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedWinner) {
      toast.error("Please select a winner before submitting");
      return;
    }
    
    if (disabled || votedFor) {
      toast.info("You've already voted or voting is closed");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onVote(selectedWinner);
      toast.success("Your vote has been recorded!");
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error("Failed to submit your vote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-secondary border-2 border-black shadow-neo hover:shadow-neo-hover hover:-translate-y-1 hover:translate-x-1 transition-all">
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
            className={`p-4 border-2 cursor-pointer transition-all transform hover:-translate-y-1 hover:translate-x-1 ${
              selectedWinner === option.id 
                ? 'border-black bg-[#F8C537] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                : 'border-black bg-[#FFB4A8] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
            }`}
            onClick={() => !disabled && setSelectedWinner(option.id)}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-black needs-radius">
                <AvatarImage src={option.avatar} alt={option.name} />
                <AvatarFallback className="bg-[#A6C7F7] text-black font-bold">
                  {option.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-bold text-black">{option.name}</h3>
                <p className="text-xs text-black/70">
                  {!disabled 
                    ? selectedWinner === option.id 
                      ? 'Selected as winner' 
                      : 'Tap to select'
                    : votedFor === option.id 
                      ? 'Your vote' 
                      : 'Voting closed'
                  }
                </p>
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
          disabled={!selectedWinner || disabled || !!votedFor || isSubmitting} 
          className="w-full bg-[#F8C537] text-black border-2 border-black hover:bg-[#F8C537]/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 transition-all transform font-bold text-lg h-12"
        >
          {isSubmitting 
            ? 'Submitting...' 
            : votedFor 
              ? 'Vote Submitted' 
              : 'Submit Vote'
          }
        </Button>
      </CardFooter>
    </Card>
  );
};
