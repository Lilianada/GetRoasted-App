import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";
import { formatDistanceToNow } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { Flame, Trash2, Users, Clock } from "lucide-react";

const UserBattlesList = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [battles, setBattles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserBattles = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('battles')
          .select('*, battle_participants(user_id)')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBattles(data || []);
      } catch (error) {
        console.error("Error fetching battles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBattles();

    // Set up realtime listener for updates
    const channel = supabase
      .channel('user-battles-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battles', filter: `created_by=eq.${user.id}` }, 
        fetchUserBattles
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleDeleteBattle = async (battleId: string) => {
    try {
      setDeletingId(battleId);
      
      // First, delete battle votes associated with the battle
      const { error: votesError } = await supabase
        .from('battle_votes')
        .delete()
        .eq('battle_id', battleId);
        
      if (votesError) throw votesError;
      
      // Delete battle messages associated with the battle
      const { error: messagesError } = await supabase
        .from('battle_messages')
        .delete()
        .eq('battle_id', battleId);
        
      if (messagesError) throw messagesError;
      
      // Delete roasts associated with the battle
      const { error: roastsError } = await supabase
        .from('roasts')
        .delete()
        .eq('battle_id', battleId);
        
      if (roastsError) throw roastsError;
      
      // Delete battle spectators associated with the battle
      const { error: spectatorsError } = await supabase
        .from('battle_spectators')
        .delete()
        .eq('battle_id', battleId);
        
      if (spectatorsError) throw spectatorsError;
      
      // Delete battle participants first (due to foreign key constraints)
      const { error: participantsError } = await supabase
        .from('battle_participants')
        .delete()
        .eq('battle_id', battleId);
        
      if (participantsError) throw participantsError;
      
      // Then delete the battle
      const { error } = await supabase
        .from('battles')
        .delete()
        .eq('id', battleId);
        
      if (error) throw error;
      
      // Update local state to immediately reflect the change
      setBattles(prevBattles => prevBattles.filter(battle => battle.id !== battleId));
      
      toast.success("Battle deleted successfully");
      
    } catch (error: any) {
      toast.error(`Failed to delete battle: ${error.message}`);
      console.error("Error deleting battle:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const getBattleStatusDisplay = (status: string, participantsCount: number) => {
    switch (status) {
      case 'waiting':
        return (
          <div className="flex items-center gap-2 text-yellow-500">
            <Clock className="h-4 w-4" />
            <span>Waiting {participantsCount < 2 ? 'for opponent' : 'to start'}</span>
          </div>
        );
      case 'active':
        return (
          <div className="flex items-center gap-2 text-green-500">
            <Flame className="h-4 w-4" />
            <span>In Progress</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-2 text-blue-500">
            <Users className="h-4 w-4" />
            <span>Completed</span>
          </div>
        );
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader size="large" />
      </div>
    );
  }

  if (battles.length === 0) {
    return (
      <Card className="bg-secondary border-2 border-black">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <p className="text-muted-foreground text-center">
            You haven't created any battles yet.
          </p>
          <Button 
            onClick={() => navigate('/battles/new')} 
            className="mt-4 gap-2 bg-flame-500 hover:bg-flame-600 text-white"
          >
            <Flame className="h-4 w-4" />
            Create a Battle
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-secondary border-2 border-black">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {battles.map((battle) => {
              const participantsCount = battle.battle_participants?.length || 0;
              
              return (
                <TableRow key={battle.id}>
                  <TableCell className="font-medium">
                    <Button 
                      variant="link" 
                      onClick={() => {
                        if (battle.status === 'waiting') {
                          navigate(`/battles/waiting/${battle.id}`);
                        } else {
                          navigate(`/battles/${battle.id}`);
                        }
                      }}
                      className="p-0 h-auto font-medium text-left justify-start"
                    >
                      {battle.title}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {getBattleStatusDisplay(battle.status, participantsCount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {battle.created_at ? formatDistanceToNow(new Date(battle.created_at), { addSuffix: true }) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className={`capitalize ${battle.type === 'private' ? 'text-purple-500' : 'text-green-500'}`}>
                      {battle.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          disabled={deletingId === battle.id}
                        >
                          {deletingId === battle.id ? (
                            <Loader size="small" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Battle</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this battle? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-500 hover:bg-red-600 text-white" 
                            onClick={() => handleDeleteBattle(battle.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserBattlesList;
