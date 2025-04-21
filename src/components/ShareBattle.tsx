
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Copy, Share2, Twitter, Facebook, Mail } from "lucide-react";

interface ShareBattleProps {
  battleId: string;
  trigger?: React.ReactNode;
}

const ShareBattle = ({ battleId, trigger }: ShareBattleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("link");
  
  // Generate the shareable link
  const battleUrl = `${window.location.origin}/battle/${battleId}`;
  
  // Function to copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(battleUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link");
    }
  };
  
  // Function to share on social media
  const shareOnSocial = (platform: string) => {
    let shareUrl = "";
    const text = "Join me in this epic roast battle on GetRoasted!";
    
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(battleUrl)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(battleUrl)}`;
        break;
      default:
        shareUrl = "";
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank");
      setIsOpen(false);
    }
  };
  
  // Function to share via email
  const shareViaEmail = () => {
    const subject = "Join my roast battle on GetRoasted!";
    const body = `I'm in a roast battle and need your wit! Join me here: ${battleUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setIsOpen(true)}
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] bg-night-800 border-night-700">
        <DialogHeader>
          <DialogTitle>Share Battle</DialogTitle>
          <DialogDescription>
            Invite others to join or watch this epic roast battle
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="link" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="space-y-4 pt-4">
            <div className="flex space-x-2">
              <Input 
                readOnly 
                value={battleUrl} 
                className="border-night-700 focus-visible:ring-flame-500"
              />
              <Button 
                type="button"
                size="icon"
                onClick={copyLink}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this link with friends to invite them to the battle
            </p>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => shareOnSocial("twitter")}
              >
                <Twitter className="h-6 w-6 text-blue-500" />
                <span>Twitter</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => shareOnSocial("facebook")}
              >
                <Facebook className="h-6 w-6 text-blue-700" />
                <span>Facebook</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="contacts" className="space-y-4 pt-4">
            <Button 
              variant="outline" 
              className="w-full h-16 flex items-center justify-center gap-3"
              onClick={shareViaEmail}
            >
              <Mail className="h-6 w-6 text-flame-500" />
              <div className="text-left">
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">Send an invite via email</p>
              </div>
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Invite friends from your contacts to join the battle
            </p>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareBattle;
