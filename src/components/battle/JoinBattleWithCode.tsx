
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useBattleCode } from "@/hooks/useBattleCode";
import { useNavigate } from "react-router-dom";

const JoinBattleWithCode = () => {
  const [battleCode, setBattleCode] = useState('');
  const { validateBattleCode, isValidating } = useBattleCode();
  const navigate = useNavigate();

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and limit to 6 characters
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setBattleCode(value);
  };

  const handleJoinBattle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const battleData = await validateBattleCode(battleCode);
    if (battleData) {
      navigate(`/battles/join/${battleData.id}`);
    }
  };

  return (
    <Card className="bg-secondary border-2 border-black">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Join Battle with Code</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleJoinBattle} className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-full max-w-xs">
              <Input
                value={battleCode}
                onChange={handleCodeChange}
                placeholder="Enter 6-digit code"
                className="text-center text-2xl tracking-widest font-mono h-14 border-2 border-night-700"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                required
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              Enter the 6-digit code shared by your opponent
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full gap-2 bg-yellow hover:opacity-90 text-night-900"
            disabled={isValidating || battleCode.length !== 6}
          >
            {isValidating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4" />
                Join Battle
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JoinBattleWithCode;
