import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BattleCreationForm } from "@/components/battle/BattleCreationForm";
import { BattleSidebar } from "@/components/battle/BattleSidebar";

interface CreateBattleDialogProps {
  children?: React.ReactNode;
}

const CreateBattleDialog = ({ children }: CreateBattleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [battleId, setBattleId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);

  const handleCopyLink = () => {
    if (!inviteCode) return;
    
    navigator.clipboard.writeText(inviteCode);
    
    setShowCopied(true);
    setTimeout(() => {
      setShowCopied(false);
    }, 2000);
  };

  // Custom trigger if children are provided, otherwise use default
  const triggerElement = children ? (
    <DialogTrigger asChild>
      {children}
    </DialogTrigger>
  ) : (
    <DialogTrigger asChild>
      <Button>Create Battle</Button>
    </DialogTrigger>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerElement}
      <DialogContent className="max-w-4xl bg-secondary p-0 border-2 border-black">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">Create New Battle</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BattleCreationForm 
              setBattleId={setBattleId}
              setInviteCode={setInviteCode}
              onSuccess={() => {
                // Keep dialog open to show the invite code
              }}
            />
          </div>
          
          <BattleSidebar 
            battleId={battleId}
            inviteCode={inviteCode}
            showCopied={showCopied}
            handleCopyLink={handleCopyLink}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBattleDialog;
