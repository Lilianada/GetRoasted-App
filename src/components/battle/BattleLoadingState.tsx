
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

interface BattleLoadingStateProps {
  isError?: boolean;
}

const BattleLoadingState = ({ isError }: BattleLoadingStateProps) => {
  const navigate = useNavigate();
  
  if (isError) {
    return (
      <div className="min-h-screen bg-night flex flex-col">
        <div className="container py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Battle Not Found</h2>
            <p className="text-muted-foreground mb-6">The battle you're looking for doesn't exist or has been deleted.</p>
            <Button onClick={() => navigate('/battles')}>
              Return to Battles
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-night flex flex-col">
      <main className="container flex-1 py-8 flex items-center justify-center">
        <Loader size="large" variant="colorful" />
      </main>
    </div>
  );
};

export default BattleLoadingState;
