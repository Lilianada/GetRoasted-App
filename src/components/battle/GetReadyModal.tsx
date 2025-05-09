
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GetReadyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countdown: number;
  onComplete?: () => void;
  canProceed?: boolean;
}

const GetReadyModal = ({ 
  open, 
  onOpenChange, 
  countdown, 
  onComplete,
  canProceed = true
}: GetReadyModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-night-800 border-flame-500 max-w-md text-center p-8">
        <DialogTitle className="text-3xl font-bold text-flame-500">Get Ready!</DialogTitle>
        <DialogDescription className="text-white">
          Your battle is about to begin
        </DialogDescription>
        <div className="flex flex-col items-center justify-center gap-6 py-6">
          <div className="w-24 h-24 rounded-full bg-flame-500 flex items-center justify-center text-4xl font-bold text-white">
            {countdown}
          </div>
          <p className="text-lg text-white">Your battle is about to begin...</p>
          
          {countdown <= 0 && canProceed && (
            <Button 
              onClick={onComplete} 
              size="lg" 
              className="bg-flame-500 hover:bg-flame-600 text-white px-8 mt-2"
            >
              Enter Battle Room
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GetReadyModal;
