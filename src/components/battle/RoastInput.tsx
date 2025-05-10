
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff } from "lucide-react";

interface RoastInputProps {
  onSendRoast: (content: string, isVoice?: boolean) => Promise<void>;
  isPlayerTurn: boolean;
  disabled?: boolean;
}

const RoastInput: React.FC<RoastInputProps> = ({ 
  onSendRoast,
  isPlayerTurn,
  disabled = false
}) => {
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSendRoast = async () => {
    if (!content.trim()) return;
    
    try {
      await onSendRoast(content);
      setContent('');
    } catch (error) {
      console.error('Error sending roast:', error);
    }
  };
  
  const toggleVoiceRecording = () => {
    // This is a placeholder for voice recording functionality
    setIsRecording(!isRecording);
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex items-center gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isPlayerTurn ? "Type your roast..." : "Wait for your turn..."}
          className="resize-none min-h-[100px]"
          disabled={!isPlayerTurn && disabled} // Remove disabled when it's player's turn
        />
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleVoiceRecording}
          disabled={!isPlayerTurn && disabled} // Remove disabled when it's player's turn
          className="rounded-full"
        >
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        
        <Button
          onClick={handleSendRoast}
          disabled={!content.trim() || (!isPlayerTurn && disabled)} // Only disabled if no content or not player's turn
          className="flex items-center gap-2"
        >
          Send <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RoastInput;
