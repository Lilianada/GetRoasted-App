
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
          className={`min-h-[100px] pr-24 resize-none border-2 border-black rounded-xl bg-white text-black font-medium placeholder:text-black/50 ${
            isWarning ? "border-[#F97316]" : ""
          }`}
        />
        
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <span className={`text-xs font-bold ${
            isWarning ? "text-[#F97316]" : "text-black/70"
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
                  className={`border-2 border-black bg-[#C5B4F0] text-black ${!canUseVoiceRecording ? "opacity-50" : ""}`}
                  onClick={handleVoiceButtonClick}
                  disabled={isDisabled || timeRemaining === 0}
                >
                  {!canUseVoiceRecording && (
                    <span className="absolute -top-1 -right-1 text-[#F97316]">
                      <Lock className="h-3 w-3" />
                    </span>
                  )}
                  <Mic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white border-2 border-[#F8C537]">
                <p>{canUseVoiceRecording ? "Voice input" : "Pro feature: Voice input"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button
            type="submit"
            size="icon"
            disabled={isDisabled || text.trim().length === 0 || timeRemaining === 0}
            className={`bg-[#F8C537] text-black border-2 border-black hover:bg-[#F8C537]/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 transition-all ${
              text.trim().length === 0 ? "opacity-50" : ""
            }`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isWarning && (
        <div className="flex items-center gap-1 mt-1 text-[#F97316] text-xs font-bold">
          <AlertCircle className="h-3 w-3" />
          <span>Approaching character limit</span>
        </div>
      )}
      
      {timeRemaining !== undefined && timeRemaining <= 30 && (
        <div className="flex items-center gap-1 mt-1 text-[#F97316] text-xs font-bold">
          <AlertCircle className="h-3 w-3" />
          <span>{timeRemaining === 0 ? "Time's up!" : `${timeRemaining}s remaining!`}</span>
        </div>
      )}
      
      {!isPro && (
        <div className="flex items-center gap-1 mt-1 text-[#F8C537] text-xs font-bold">
          <Crown className="h-3 w-3" />
          <span>
            Upgrade to Pro for {700 - effectiveMaxLength} more characters and voice recording
          </span>
        </div>
      )}
      
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="bg-[#C5B4F0] border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <DialogHeader>
            <DialogTitle className="text-black text-2xl font-black">Unlock Pro Features</DialogTitle>
            <DialogDescription className="text-black/70 font-medium">
              Upgrade to Pro to access voice recording, extended character limits, and more!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 bg-[#A6C7F7] p-4 border-2 border-black rounded-lg">
              <div className="bg-[#F8C537] p-2 rounded-full border-2 border-black">
                <Mic className="h-5 w-5 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-black">Voice Recording</h3>
                <p className="text-sm text-black/70 font-medium">
                  Record your roasts with your voice for added effect
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-[#A6C7F7] p-4 border-2 border-black rounded-lg">
              <div className="bg-[#F8C537] p-2 rounded-full border-2 border-black">
                <AlertCircle className="h-5 w-5 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-black">Extended Character Limit</h3>
                <p className="text-sm text-black/70 font-medium">
                  700 characters per roast instead of 280
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-[#A6C7F7] p-4 border-2 border-black rounded-lg">
              <div className="bg-[#F8C537] p-2 rounded-full border-2 border-black">
                <Lock className="h-5 w-5 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-black">Private Battle Rooms</h3>
                <p className="text-sm text-black/70 font-medium">
                  Create invite-only rooms for your friends
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setShowUpgradeModal(false)} 
              className="bg-[#FFB4A8] text-black border-2 border-black hover:bg-[#FFB4A8]/90">
              Not Now
            </Button>
            <Button 
              className="bg-[#F8C537] text-black border-2 border-black hover:bg-[#F8C537]/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 transition-all font-bold"
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
