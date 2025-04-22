
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

export function AccountSettings() {
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirmation !== "DELETE") return;
    
    setIsDeleting(true);
    try {
      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to delete account');
      
      toast.success("Account deleted successfully");
      signOut();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
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
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
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
