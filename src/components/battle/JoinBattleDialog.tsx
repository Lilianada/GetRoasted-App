
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import JoinWithCodeForm from "./JoinWithCodeForm";

interface JoinBattleDialogProps {
  children?: React.ReactNode;
}

const JoinBattleDialog = ({ children }: JoinBattleDialogProps) => {
  const [open, setOpen] = useState(false);
  
  // Custom trigger if children are provided, otherwise use default
  const triggerElement = children ? (
    <DialogTrigger asChild>
      {children}
    </DialogTrigger>
  ) : (
    <DialogTrigger asChild>
      <Button variant="outline" className="border-night-700 gap-2">
        Join Battle
        <ArrowRight className="h-4 w-4" />
      </Button>
    </DialogTrigger>
  );
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerElement}
      <DialogContent className="sm:max-w-md bg-secondary border-2 border-black">
        <DialogHeader>
          <DialogTitle className="text-xl">Join Battle with Code</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <JoinWithCodeForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinBattleDialog;
