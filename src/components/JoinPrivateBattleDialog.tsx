
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface JoinPrivateBattleDialogProps {
  children?: React.ReactNode;
}

const JoinPrivateBattleDialog = ({ children }: JoinPrivateBattleDialogProps) => {
  const [battleLink, setBattleLink] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  
  const handleJoin = () => {
    if (!battleLink.trim()) {
      toast.error("Please enter a battle link or ID");
      return;
    }
    
    setIsJoining(true);
    
    try {
      // Extract battle ID from link or use as-is if it's just an ID
      let battleId = battleLink.trim();
      
      // Check if it's a full URL
      if (battleLink.includes('/')) {
        const urlParts = battleLink.split('/');
        battleId = urlParts[urlParts.length - 1];
      }
      
      // Validate that it looks like a UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(battleId)) {
        toast.error("Invalid battle ID format");
        setIsJoining(false);
        return;
      }
      
      // Navigate to join page
      navigate(`/battle/join/${battleId}`);
    } catch (error) {
      console.error('Error joining private battle:', error);
      toast.error("Failed to join battle");
      setIsJoining(false);
    }
  };
  
  // Custom trigger if children are provided, otherwise use default
  const triggerElement = children ? (
    <DialogTrigger asChild>
      {children}
    </DialogTrigger>
  ) : (
    <DialogTrigger asChild>
      <Button variant="outline" className="gap-2 border-night-700">
        <LinkIcon className="h-4 w-4" />
        Join Private
      </Button>
    </DialogTrigger>
  );
  
  return (
    <Dialog>
      {triggerElement}
      <DialogContent className="flame-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Private Battle</DialogTitle>
          <DialogDescription>
            Enter an invite link or battle ID to join a private battle.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Input
            placeholder="Battle link or ID"
            value={battleLink}
            onChange={(e) => setBattleLink(e.target.value)}
            className="border-night-700 focus-visible:ring-flame-500"
          />
          
          <p className="text-xs text-muted-foreground mt-2">
            Paste a battle link that was shared with you or enter the battle ID directly.
          </p>
        </div>
        
        <DialogFooter>
          <Button 
            type="submit" 
            className="bg-gradient-flame hover:opacity-90"
            disabled={isJoining}
            onClick={handleJoin}
          >
            {isJoining ? 'Joining...' : 'Join Battle'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinPrivateBattleDialog;
