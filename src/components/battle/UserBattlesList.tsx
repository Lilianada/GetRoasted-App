
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ArrowRight, PlusCircle } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import BattleStatusBadge from "./BattleStatusBadge";
import JoinBattleDialog from "./JoinBattleDialog";
import Loader from "@/components/ui/loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface UserBattle {
  id: string;
  title: string;
  status: 'waiting' | 'ready' | 'active' | 'completed';
  type: 'public' | 'private';
  created_at: string;
  invite_code?: string;
}

export const UserBattlesList = () => {
  const [battles, setBattles] = useState<UserBattle[]>([]);
  const [loading, setLoading] = useState(true);
  const [battleToDelete, setBattleToDelete] = useState<string | null>(null);
  const [isDeletingBattle, setIsDeletingBattle] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  const fetchUserBattles = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("battles")
        .select("id, title, status, type, created_at, invite_code")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setBattles(data || []);
    } catch (error) {
      console.error("Error fetching user battles:", error);
      toast.error("Failed to load your battles");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteBattle = async () => {
    if (!battleToDelete || !user) return;
    
    try {
      setIsDeletingBattle(true);
      const { error } = await supabase
        .from("battles")
        .delete()
        .eq("id", battleToDelete)
        .eq("created_by", user.id);
        
      if (error) throw error;
      
      // Only show success toast if deletion was successful
      toast.success("Battle deleted successfully");
      fetchUserBattles(); // Refresh the list
    } catch (error) {
      console.error("Error deleting battle:", error);
      toast.error("Failed to delete battle");
    } finally {
      setIsDeletingBattle(false);
      setBattleToDelete(null); // Close the dialog
    }
  };
  
  const navigateToBattle = (battle: UserBattle) => {
    switch(battle.status) {
      case 'waiting':
        navigate(`/battles/waiting/${battle.id}`);
        break;
      case 'ready':
      case 'active':
        navigate(`/battles/live/${battle.id}`);
        break;
      case 'completed':
        navigate(`/battles/${battle.id}`);
        break;
    }
  };
  
  useEffect(() => {
    fetchUserBattles();
  }, [user]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Button className="gap-2" onClick={() => navigate('/battles/new')}>
          <PlusCircle className="h-4 w-4" />
          Create Battle
        </Button>
        
        <JoinBattleDialog />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader size="medium" variant="colorful" />
          </div>
        ) : battles.length > 0 ? (
          battles.map((battle) => (
            <Card key={battle.id} className="border-2 border-black shadow-neo">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-1">{battle.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <BattleStatusBadge status={battle.status} />
                      <Badge variant="outline" className="border-night-700">
                        {battle.type.charAt(0).toUpperCase() + battle.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setBattleToDelete(battle.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(battle.created_at).toLocaleDateString()}
                </p>
                {battle.invite_code && (
                  <p className="text-sm mt-1">
                    Invite code: <span className="font-mono bg-night-100/10 px-1.5 py-0.5 rounded">{battle.invite_code}</span>
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigateToBattle(battle)} 
                  className="w-full gap-2"
                >
                  Go to Battle
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground mb-4">You haven't created any battles yet</p>
            <Button className="gap-2" onClick={() => navigate('/battles/new')}>
              <PlusCircle className="h-4 w-4" />
              Create Your First Battle
            </Button>
          </div>
        )}
      </div>
      
      <AlertDialog open={!!battleToDelete} onOpenChange={(open) => !open && setBattleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this battle?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the battle and all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingBattle}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteBattle();
              }}
              disabled={isDeletingBattle}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeletingBattle ? "Deleting..." : "Delete Battle"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserBattlesList;
