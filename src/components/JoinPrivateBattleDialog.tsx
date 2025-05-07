
import { useState } from "react";
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
import { Link as LinkIcon } from "lucide-react";
import JoinWithCodeForm from "./battle/JoinWithCodeForm";

interface JoinPrivateBattleDialogProps {
  children?: React.ReactNode;
}

const JoinPrivateBattleDialog = ({ children }: JoinPrivateBattleDialogProps) => {
  const [open, setOpen] = useState(false);
  
  // Custom trigger if children are provided, otherwise use default
  const triggerElement = children ? (
    <DialogTrigger asChild>
      {children}
    </DialogTrigger>
  ) : (
    <DialogTrigger asChild>
      <Button variant="outline" className="gap-2 border-night-700">
        <LinkIcon className="h-4 w-4 text-flame-500" />
        Join with Code
      </Button>
    </DialogTrigger>
  );
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerElement}
      <DialogContent className="sm:max-w-md bg-secondary border-2 border-black">
        <DialogHeader>
          <DialogTitle className="text-xl">Join Battle with Code</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter a 6-digit code to join an existing battle
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <JoinWithCodeForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinPrivateBattleDialog;
