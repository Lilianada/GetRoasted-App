
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import BattleReadyConfirmation from "./BattleReadyConfirmation";

interface GetReadyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  battleId: string;
  participantCount: number;
  onBothPlayersReady?: () => void;
  countdown?: number;
}

const GetReadyModal = ({ 
  open, 
  onOpenChange, 
  battleId, 
  participantCount, 
  onBothPlayersReady,
  countdown
}: GetReadyModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-night-800 border-flame-500 max-w-md text-center p-8">
        <DialogTitle className="text-3xl font-bold text-flame-500">Get Ready!</DialogTitle>
        <DialogDescription className="text-white">
          Your battle is about to begin
          {countdown !== undefined && (
            <div className="text-4xl font-bold mt-2">{countdown}</div>
          )}
        </DialogDescription>
        <div className="flex flex-col items-center justify-center gap-6 py-6">
          <BattleReadyConfirmation 
            battleId={battleId}
            participantCount={participantCount}
            onBothPlayersReady={onBothPlayersReady}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GetReadyModal;
