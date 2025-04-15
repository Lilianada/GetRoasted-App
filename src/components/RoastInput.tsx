
import { useState, useEffect } from "react";
import { Send, Mic, AlertCircle, Crown, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useSubscription } from "@/hooks/useSubscription";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";

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
  maxLength,
}: RoastInputProps) => {
  const { isPro, maxCharacters, canUseVoiceRecording } = useSubscription();
  const [text, setText] = useState("");
  const [isWarning, setIsWarning] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Use subscription-based max length or fallback to prop
  const effectiveMaxLength = maxLength || maxCharacters;
  
  // Reset warning state when maxLength changes (e.g., when subscription changes)
  useEffect(() => {
    setIsWarning(text.length > effectiveMaxLength * 0.8);
  }, [effectiveMaxLength, text.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length === 0) return;
    
    onSubmit(text.trim());
    setText("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Show warning if close to max length
    if (value.length > effectiveMaxLength * 0.8) {
      setIsWarning(true);
    } else {
      setIsWarning(false);
    }
    
    // Limit input to maxLength
    if (value.length <= effectiveMaxLength) {
      setText(value);
    }
  };

  const handleVoiceButtonClick = () => {
    if (!canUseVoiceRecording) {
      setShowUpgradeModal(true);
      return;
    }
    
    // Handle voice recording for pro users
    toast.info("Voice recording started", {
      description: "Speak your roast now!"
    });
    
    // In a real app, we would implement voice recording here
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
            {text.length}/{effectiveMaxLength}
          </span>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className={`text-muted-foreground ${!canUseVoiceRecording ? "opacity-50" : ""}`}
                  onClick={handleVoiceButtonClick}
                  disabled={isDisabled || timeRemaining === 0}
                >
                  {!canUseVoiceRecording && (
                    <span className="absolute -top-1 -right-1 text-flame-500">
                      <Lock className="h-3 w-3" />
                    </span>
                  )}
                  <Mic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{canUseVoiceRecording ? "Voice input" : "Pro feature: Voice input"}</p>
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
      
      {!isPro && (
        <div className="flex items-center gap-1 mt-1 text-flame-500 text-xs">
          <Crown className="h-3 w-3" />
          <span>
            Upgrade to Pro for {700 - effectiveMaxLength} more characters and voice recording
          </span>
        </div>
      )}
      
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="bg-night-800 border-night-700">
          <DialogHeader>
            <DialogTitle>Unlock Pro Features</DialogTitle>
            <DialogDescription>
              Upgrade to Pro to access voice recording, extended character limits, and more!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-flame-500/20 p-2 rounded-full">
                <Mic className="h-5 w-5 text-flame-500" />
              </div>
              <div>
                <h3 className="font-medium">Voice Recording</h3>
                <p className="text-sm text-muted-foreground">
                  Record your roasts with your voice for added effect
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-flame-500/20 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-flame-500" />
              </div>
              <div>
                <h3 className="font-medium">Extended Character Limit</h3>
                <p className="text-sm text-muted-foreground">
                  700 characters per roast instead of 280
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-flame-500/20 p-2 rounded-full">
                <Lock className="h-5 w-5 text-flame-500" />
              </div>
              <div>
                <h3 className="font-medium">Private Battle Rooms</h3>
                <p className="text-sm text-muted-foreground">
                  Create invite-only rooms for your friends
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>
              Not Now
            </Button>
            <Button 
              className="bg-gradient-flame hover:opacity-90"
              onClick={() => {
                setShowUpgradeModal(false);
                // Navigate to billing page in a real app
              }}
            >
              Upgrade to Pro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default RoastInput;
