
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

const AccountSettings = () => {
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const { user, deleteAccount } = useAuthContext();

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Confirmation text doesn't match");
      return;
    }
    
    try {
      await deleteAccount();
      // Note: The redirect happens in the deleteAccount function after successful deletion
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-night-800 border border-destructive/40 p-6 rounded-lg">
        <h3 className="text-lg font-medium flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </h3>
        <p className="text-card text-sm mt-1 mb-4">
          Irreversible actions that affect your account
        </p>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-night-800 border-night-700">
            <DialogHeader>
              <DialogTitle className="text-destructive">Delete Account</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove all your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p className="text-sm text-muted-foreground">
                To confirm, type <span className="font-bold text-destructive">DELETE</span> in the field below:
              </p>
              <Input
                className="border-night-700"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== "DELETE"}
              >
                Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AccountSettings;
