
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, PlusCircle, ArrowRight } from "lucide-react";
import JoinBattleWithCode from "./JoinBattleWithCode";

const BattleLobbyOptions = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-secondary border-2 border-black p-6">
        <CardContent className="flex flex-col items-center justify-center gap-6 h-full">
          <div className="bg-flame-500 rounded-full p-4">
            <PlusCircle className="h-10 w-10 text-white" />
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Create a Battle</h3>
            <p className="text-muted-foreground mb-6">
              Start a new battle and get a 6-digit code to share with your opponent
            </p>
            
            <Button
              onClick={() => navigate('/battles/new')}
              className="gap-2 bg-flame-500 hover:bg-flame-600 text-white"
              size="lg"
            >
              <Flame className="h-4 w-4" />
              Create New Battle
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <JoinBattleWithCode />
    </div>
  );
};

export default BattleLobbyOptions;
