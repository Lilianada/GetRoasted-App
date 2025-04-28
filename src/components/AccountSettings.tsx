
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
  DialogClose,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

const CONFIRM_STRING = "DELETE";

const AccountSettings: React.FC = () => {
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { user, deleteAccount }: { user: any, deleteAccount: () => Promise<void> } = useAuthContext();

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== CONFIRM_STRING) {
      toast.error("Confirmation text doesn't match");
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success("Account deleted successfully");
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation("");
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
                To confirm, type <span className="font-bold text-destructive">{CONFIRM_STRING}</span> in the field below:
              </p>
              <Input
                className="border-night-700"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                aria-label="Delete confirmation"
                disabled={isDeleting}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={isDeleting}>Cancel</Button>
              </DialogClose>
              <Button 
                type="button" 
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== CONFIRM_STRING || isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AccountSettings;
