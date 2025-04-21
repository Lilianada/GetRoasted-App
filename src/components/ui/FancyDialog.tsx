
import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";

interface FancyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  children: React.ReactNode;
}

export default function FancyDialog({ open, onOpenChange, title, children }: FancyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 bg-gradient-to-tr from-[#F9D7E3] via-[#A6C7F7] to-[#F8C537] border-none shadow-neo-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black gradient-text drop-shadow py-6 text-center">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col py-6 px-4 items-center">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
