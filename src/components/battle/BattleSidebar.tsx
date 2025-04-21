
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Users } from "lucide-react";

interface BattleSidebarProps {
  battleId?: string | null;
  showCopied: boolean;
  handleCopyLink: () => void;
}

export const BattleSidebar = ({
  battleId,
  showCopied,
  handleCopyLink
}: BattleSidebarProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-yellow border-2 border-black p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-flame-500" />
          Invite Opponents
        </h3>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            After creating your battle, you'll get a link to share with people you want to battle with.
          </p>
          
          {battleId && (
            <>
              <div className="flex items-center gap-2">
                <Input
                  value={`${window.location.origin}/battle/join/${battleId}`}
                  readOnly
                  className="border-night-700"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-night-700" 
                  onClick={handleCopyLink}
                >
                  {showCopied ? (
                    <span className="text-xs font-medium text-green-500">Copied!</span>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
      
      <Card className="bg-yellow border-2 border-black p-6">
        <h3 className="text-lg font-semibold mb-4">Community Guidelines</h3>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Roasts should be clever and funny, not cruel. Focus on wit, not personal attacks.
          </p>
          
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• No hate speech or discrimination</li>
            <li>• No threatening language</li>
            <li>• Keep it creative and humorous</li>
            <li>• Don't share private information</li>
          </ul>
          
          <p className="text-sm text-muted-foreground">
            Violating these guidelines may result in account suspension.
          </p>
        </div>
      </Card>
    </div>
  );
};
