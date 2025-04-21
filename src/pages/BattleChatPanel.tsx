import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import React from "react";

interface BattleChatPanelProps {
  spectatorCount: number;
  chatInput: string;
  setChatInput: (v: string) => void;
  handleSendChat: () => void;
  showChat: boolean;
}

const BattleChatPanel: React.FC<BattleChatPanelProps> = ({
  spectatorCount,
  chatInput,
  setChatInput,
  handleSendChat,
  showChat,
}) => {
  return (
    <div className={`w-full lg:w-80 ${showChat ? "block" : "hidden lg:block"}`}>
      <Card className="bg-yellow border-2 border-black border-night-700 h-full">
        <div className="flex items-center justify-between p-3 border-b border-night-700">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-flame-500" />
            <h2 className="font-medium">Spectator Chat</h2>
          </div>
          <Badge variant="outline" className="bg-night-700">
            {spectatorCount}
          </Badge>
        </div>
        <div className="p-3 h-[500px] lg:h-[calc(100vh-350px)] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 mb-3">
            {/* TODO: Render real spectator chat when implemented */}
          </div>
          <Separator className="bg-night-700 my-2" />
          <div className="relative">
            <Input 
              placeholder="Type a message..."
              className="pr-10 border-night-700 focus-visible:ring-flame-500"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <Button 
              size="icon" 
              className="absolute right-1 top-1 h-6 w-6 rounded-full bg-flame-500 hover:bg-flame-600"
              onClick={handleSendChat}
              disabled={chatInput.trim() === ""}
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BattleChatPanel;
