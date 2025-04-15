
import { useState } from "react";
import { Send, Mic, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface RoastInputProps {
  onSubmit: (text: string) => void;
  isDisabled?: boolean;
  timeRemaining?: number;
  placeholder?: string;
  maxLength?: number;
}

const RoastInput = ({
  onSubmit,
  isDisabled = false,
  timeRemaining,
  placeholder = "Type your roast...",
  maxLength = 500,
}: RoastInputProps) => {
  const [text, setText] = useState("");
  const [isWarning, setIsWarning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length === 0) return;
    
    onSubmit(text.trim());
    setText("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Show warning if close to max length
    if (value.length > maxLength * 0.8) {
      setIsWarning(true);
    } else {
      setIsWarning(false);
    }
    
    // Limit input to maxLength
    if (value.length <= maxLength) {
      setText(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Textarea
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={isDisabled}
          className={`min-h-[100px] pr-24 resize-none transition-colors focus-visible:ring-flame-500 ${
            isWarning ? "border-amber-500" : ""
          }`}
        />
        
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <span className={`text-xs ${
            isWarning ? "text-amber-500" : "text-muted-foreground"
          }`}>
            {text.length}/{maxLength}
          </span>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground"
                  disabled={isDisabled || timeRemaining === 0}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voice input (coming soon)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button
            type="submit"
            size="icon"
            disabled={isDisabled || text.trim().length === 0 || timeRemaining === 0}
            className={`bg-gradient-flame hover:opacity-90 ${
              text.trim().length === 0 ? "opacity-50" : ""
            }`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isWarning && (
        <div className="flex items-center gap-1 mt-1 text-amber-500 text-xs">
          <AlertCircle className="h-3 w-3" />
          <span>Approaching character limit</span>
        </div>
      )}
      
      {timeRemaining !== undefined && timeRemaining <= 30 && (
        <div className="flex items-center gap-1 mt-1 text-ember-500 text-xs">
          <AlertCircle className="h-3 w-3" />
          <span>{timeRemaining === 0 ? "Time's up!" : `${timeRemaining}s remaining!`}</span>
        </div>
      )}
    </form>
  );
};

export default RoastInput;
