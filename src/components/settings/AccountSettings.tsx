
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
// useNavigate is not needed here anymore as deleteAccount from context handles navigation
// import { useNavigate } from "react-router-dom"; 
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

export function AccountSettings() {
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  // Get deleteAccount from context. signOut and navigate are handled by context's deleteAccount.
  const { user, deleteAccount } = useAuthContext(); 
  // const navigate = useNavigate(); // Not needed

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirmation !== "DELETE") {
      if (deleteConfirmation !== "DELETE") {
        toast.warning("Please type DELETE to confirm account deletion.");
      }
      return;
    }
    
    setIsDeleting(true);
    try {
      // Use the deleteAccount function from AuthContext
      await deleteAccount();
      // Success toast, signOut, and navigation are handled by the deleteAccount function in useAuth.tsx
    } catch (error) {
      // Error is already logged and toasted by the deleteAccount function in useAuth.tsx
      // We just need to ensure isDeleting is reset.
      // A generic toast here might be redundant but can be kept as a fallback if desired,
      // though usually the more specific one from useAuth is better.
      // For now, we'll rely on the toast from useAuth.tsx.
      console.error('Error during account deletion process in component:', error);
    } finally {
      setIsDeleting(false);
      // Optionally clear confirmation text after attempt
      // setDeleteConfirmation(''); 
    }
  };

  return (
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
            disabled={isDeleting}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={deleteConfirmation !== "DELETE" || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
