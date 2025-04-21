
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AccountCreatedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

const AccountCreatedDialog = ({ 
  open, 
  onOpenChange, 
  email 
}: AccountCreatedDialogProps) => {
  const navigate = useNavigate();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-md bg-gradient-to-br from-night-800 to-night-900 border-2 border-night-600 text-white shadow-neo-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-flame-500 via-yellow to-purple animate-background-shine"></div>
        
        <div className="p-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow to-flame-500 flex items-center justify-center animate-pop">
              <Mail size={40} className="text-black" />
            </div>
            
            <h2 className="text-2xl font-black text-white">You're Almost There!</h2>
            
            <div className="space-y-3">
              <p className="text-night-200">
                Get ready to roast some asses off — or perhaps, you'll get roasted? 
              </p>
              <p className="text-night-200">
                Check your email <span className="text-yellow font-bold">{email}</span> for the confirmation link and we'll find out which category you fall under.
              </p>
            </div>
            
            <div className="py-4 text-sm text-night-300 border-t border-night-700 w-full">
              <p>Didn't receive an email? Check your spam folder or try again in a few minutes.</p>
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="w-full"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  onOpenChange(false);
                  navigate('/login');
                }}
                className="w-full"
              >
                Go to Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountCreatedDialog;
