
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

interface UsernamePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (username: string) => Promise<void>;
}

const UsernamePrompt = ({ isOpen, onClose, onSubmit }: UsernamePromptProps) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }
    
    // Username validation
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    
    if (username.length > 20) {
      setError("Username must be less than 20 characters");
      return;
    }
    
    // Only allow letters, numbers, and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores");
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");
      
      // Here we'd typically check username availability in Supabase
      // For demo purposes, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would update the username in Supabase
      await onSubmit(username);
      
      toast.success("Username set successfully!");
      onClose();
    } catch (err) {
      setError("Failed to set username. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-night-800 border-night-700">
        <DialogHeader>
          <DialogTitle>Choose a Username</DialogTitle>
          <DialogDescription>
            Pick a unique username that others will see in battles.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="FlameThrow3r"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-night-700 focus-visible:ring-flame-500"
              disabled={isLoading}
              autoComplete="off"
            />
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              className="bg-gradient-flame hover:opacity-90 w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking availability...
                </>
              ) : "Set Username"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UsernamePrompt;
