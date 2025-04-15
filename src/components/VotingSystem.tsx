
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Star, Trophy } from "lucide-react";
import { Button } from "./ui/button";

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
  const [scores, setScores] = useState<Record<string, { creativity: number; humor: number; savagery: number }>>(() => {
    const initialScores: Record<string, { creativity: number; humor: number; savagery: number }> = {};
    options.forEach((option) => {
      initialScores[option.id] = { creativity: 0, humor: 0, savagery: 0 };
    });
    return initialScores;
  });

  const handleRatingChange = (optionId: string, category: 'creativity' | 'humor' | 'savagery', value: number) => {
    setScores((prev) => ({
      ...prev,
      [optionId]: {
        ...prev[optionId],
        [category]: value,
      },
    }));
  };

  const handleSubmit = () => {
    onVote(scores);
  };

  const isComplete = () => {
    return options.every((option) => {
      const score = scores[option.id];
      return score.creativity > 0 && score.humor > 0 && score.savagery > 0;
    });
  };

  return (
    <Card className="flame-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-flame-500" />
          Cast Your Vote
        </CardTitle>
        <CardDescription>Rate each contestant on creativity, humor, and savagery</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {options.map((option) => (
          <div key={option.id} className="space-y-4">
            <h3 className="font-bold">{option.name}</h3>
            
            <div className="space-y-3">
              <VotingCategory
                label="Creativity"
                value={scores[option.id].creativity}
                onChange={(value) => handleRatingChange(option.id, 'creativity', value)}
              />
              
              <VotingCategory
                label="Humor"
                value={scores[option.id].humor}
                onChange={(value) => handleRatingChange(option.id, 'humor', value)}
              />
              
              <VotingCategory
                label="Savagery"
                value={scores[option.id].savagery}
                onChange={(value) => handleRatingChange(option.id, 'savagery', value)}
              />
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={!isComplete()} 
          className="w-full bg-gradient-flame hover:opacity-90"
        >
          Submit Vote
        </Button>
      </CardFooter>
    </Card>
  );
};

interface VotingCategoryProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const VotingCategory = ({ label, value, onChange }: VotingCategoryProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-mono">{value}/5</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => i + 1).map((starValue) => (
          <button
            key={starValue}
            type="button"
            className={`p-1 focus:outline-none focus:ring-1 focus:ring-flame-500 rounded-md transition-colors`}
            onClick={() => onChange(starValue)}
          >
            <Star
              className={`h-5 w-5 ${
                starValue <= value ? "text-flame-500 fill-flame-500" : "text-night-600"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default VotingSystem;
