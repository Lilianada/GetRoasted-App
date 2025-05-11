
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

const EmptyBattlesList = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-secondary border-2 border-black">
      <CardContent className="flex flex-col items-center justify-center p-8">
        <p className="text-muted-foreground text-center">
          You haven't created any battles yet.
        </p>
        <Button 
          onClick={() => navigate('/battles/new')} 
          className="mt-4 gap-2 bg-flame-500 hover:bg-flame-600 text-white"
        >
          <Flame className="h-4 w-4" />
          Create a Battle
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyBattlesList;
