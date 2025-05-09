
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface BattleCodeDisplayProps {
  inviteCode: string;
  onInviteContacts: () => void;
}

const BattleCodeDisplay = ({ inviteCode, onInviteContacts }: BattleCodeDisplayProps) => {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopyLink = () => {
    if (!inviteCode) return;
    
    navigator.clipboard.writeText(inviteCode);
    setShowCopied(true);
    toast.success("Battle code copied!");
    
    // Hide the checkmark after 2 seconds
    setTimeout(() => {
      setShowCopied(false);
    }, 2000);
  };

  return (
    <div className="bg-secondary/20 p-4 rounded-lg">
      <div className="text-center mb-2">
        <h3 className="text-sm text-muted-foreground">Battle Code</h3>
        <div className="text-3xl font-mono font-bold tracking-widest">
          {inviteCode || '------'}
        </div>
      </div>
      
      <div className="flex gap-2 mt-2">
        <Button
          onClick={handleCopyLink}
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
        >
          {showCopied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Code
            </>
          )}
        </Button>
        
        <Button
          onClick={onInviteContacts}
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default BattleCodeDisplay;
