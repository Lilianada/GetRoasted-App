
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Users } from 'lucide-react';
import { useBattleContext } from '@/context/BattleContext';

interface BattleChatProps {
  chatInput: string;
  setChatInput: (value: string) => void;
  handleSendChat: () => void;
  spectatorCount: number;
  showChat: boolean;
}

const BattleChat: React.FC<BattleChatProps> = ({
  chatInput,
  setChatInput,
  handleSendChat,
  spectatorCount,
  showChat
}) => {
  if (!showChat) return null;
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 border-b-2 border-black">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Spectator Chat</CardTitle>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span className="text-xs">{spectatorCount}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-3 overflow-y-auto">
        {/* Chat messages would go here */}
        <div className="text-center text-sm text-gray-400 py-4">
          Chat messages will appear here
        </div>
      </CardContent>
      
      <div className="p-3 border-t mt-auto">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-grow"
          />
          <Button size="sm" onClick={handleSendChat} disabled={!chatInput.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BattleChat;
