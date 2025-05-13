
import React from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Trash2 } from "lucide-react";

interface DeleteBattleDialogProps {
  isDeleting: boolean;
  onDelete: () => void;
}

const DeleteBattleDialog = ({ isDeleting, onDelete }: DeleteBattleDialogProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  const handleOpenChange = (open: boolean) => {
    // If dialog is closing without clicking delete button, do nothing
    if (!open) return;
  };

  return (
    <AlertDialog onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-100"
          disabled={isDeleting}
          onClick={(e) => e.stopPropagation()}
        >
          {isDeleting ? (
            <Loader size="small" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Battle</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this battle? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-red-500 hover:bg-red-600 text-white" 
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBattleDialog;
