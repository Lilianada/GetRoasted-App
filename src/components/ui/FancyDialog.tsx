
import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface FancyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function FancyDialog({ 
  open, 
  onOpenChange, 
  title, 
  children,
  className
}: FancyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`
        p-0 relative overflow-hidden shadow-neo-lg
        bg-gradient-to-br from-night-800 to-night-900 
        border-2 border-night-600 text-white
        ${className}
      `}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow to-coral"></div>
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-1 text-night-300 hover:bg-night-700 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-white py-6 text-center">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col py-6 px-6 items-center">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
