
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle, Send } from "lucide-react";
import { BattleChat } from "@/components/BattleChat";
import { useAuthContext } from "@/context/AuthContext";
import { useParams } from "react-router-dom";
import { useBattleContext } from "@/context/BattleContext";
import { toast } from "@/components/ui/sonner";

interface BattleChatPanelProps {
  spectatorCount: number;
  chatInput: string;
  setChatInput: (value: string) => void;
  handleSendChat: () => void;
  showChat: boolean;
  isSpectator?: boolean;
}

const BattleChatPanel = ({
  spectatorCount,
  showChat,
  isSpectator = false
}: BattleChatPanelProps) => {
  const [chatInput, setChatInput] = useState("");
  const { user } = useAuthContext();
  const { battleId } = useParams<{ battleId: string }>();
  
  const handleSendChat = () => {
    if (chatInput.trim() === "") return;
    toast.success("Message sent!");
    setChatInput("");
  };
  
  if (!showChat) return null;
  
  return (
    <Card className="bg-secondary border-2 border-black flex-1 lg:max-w-[320px]">
      <CardHeader className="border-b-2 border-black pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-black flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-flame-500" />
            Chat
          </CardTitle>
          <div className="flex items-center gap-1 text-sm text-black">
            <Eye className="h-4 w-4" />
            <span>{spectatorCount}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {user && battleId ? (
          <>
            <BattleChat 
              battleId={battleId} 
              user={user}
              canSend={!isSpectator}
            />
            
            <div className="mt-4 flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button 
                size="icon" 
                onClick={handleSendChat} 
                disabled={!chatInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-sm text-gray-500">
            You need to be logged in to chat.
          </div>
        )}
        
        {isSpectator && (
          <div className="mt-2 bg-night-800 rounded p-2 text-xs text-center">
            You are in spectator mode and cannot participate in the roast battle.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BattleChatPanel;
