
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, Copy, Share2, Clock } from "lucide-react";

interface BattleSidebarProps {
  battleId: string | null;
  inviteCode?: string | null;
  showCopied: boolean;
  handleCopyLink: () => void;
}

export const BattleSidebar = ({
  battleId,
  inviteCode,
  showCopied,
  handleCopyLink
}: BattleSidebarProps) => {
  return (
    <div className="space-y-6">
      <Card className="border-night-800">
        <CardHeader>
          <CardTitle className="text-lg">Battle Code</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {battleId ? (
            <>
              <div className="bg-secondary/20 p-3 rounded flex items-center justify-between gap-2">
                <div className="font-mono text-lg tracking-wider flex-grow text-center">
                  {inviteCode || '------'}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                  onClick={handleCopyLink}
                >
                  {showCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Share this code with your opponent so they can join your battle.
              </div>
              
              <Button 
                className="w-full gap-2"
                onClick={handleCopyLink}
              >
                {showCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Code Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline"
                className="w-full gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share with Contacts
              </Button>
            </>
          ) : (
            <div className="text-center text-muted-foreground p-4">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Your battle code will appear here after creating a battle</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="border-night-800">
        <CardHeader>
          <CardTitle className="text-lg">Battle Tips</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">How to Play</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
              <li>Create a battle and share the code</li>
              <li>Wait for your opponent to join</li>
              <li>Both players must type "Start" to begin</li>
              <li>Take turns roasting each other</li>
              <li>Spectators can watch and vote</li>
            </ol>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Rules</h3>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>Keep it creative and funny</li>
              <li>No hate speech or personal attacks</li>
              <li>Submit your roast before the timer ends</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
