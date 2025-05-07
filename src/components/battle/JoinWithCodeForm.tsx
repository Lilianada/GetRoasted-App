
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight } from "lucide-react";
import { useBattleCode } from "@/hooks/useBattleCode";

const JoinWithCodeForm = () => {
  const [code, setCode] = useState('');
  const { validateBattleCode, isValidating } = useBattleCode();
  const navigate = useNavigate();
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and limit to 6 characters
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const battleData = await validateBattleCode(code);
    if (battleData) {
      navigate(`/battles/join/${battleData.id}`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          value={code}
          onChange={handleCodeChange}
          placeholder="Enter 6-digit code"
          className="text-center text-2xl tracking-widest font-mono h-12 border-night-700"
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]*"
          required
        />
        
        <p className="text-xs text-muted-foreground text-center">
          Enter the 6-digit code shared by your opponent
        </p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full gap-2"
        disabled={isValidating || code.length !== 6}
      >
        {isValidating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Validating...
          </>
        ) : (
          <>
            Join Battle
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
};

export default JoinWithCodeForm;
