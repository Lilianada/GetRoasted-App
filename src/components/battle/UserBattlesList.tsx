
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
import { Flame, Trash2, Users, Clock, ExternalLink } from "lucide-react";

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
    <Card className="bg-secondary border-2 border-black overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-secondary/80">
                <TableHead className="text-black font-bold">Title</TableHead>
                <TableHead className="text-black font-bold hidden md:table-cell">Status</TableHead>
                <TableHead className="text-black font-bold hidden sm:table-cell">Created</TableHead>
                <TableHead className="text-black font-bold hidden md:table-cell">Type</TableHead>
                <TableHead className="text-black font-bold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {battles.map((battle) => {
                const participantsCount = battle.battle_participants?.length || 0;
                
                return (
                  <TableRow 
                    key={battle.id} 
                    className="hover:bg-purple/20 transition-colors border-b border-black/20 last:border-0"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="link" 
                          onClick={() => {
                            if (battle.status === 'waiting') {
                              navigate(`/battles/waiting/${battle.id}`);
                            } else {
                              navigate(`/battles/${battle.id}`);
                            }
                          }}
                          className="p-0 h-auto font-medium text-left justify-start text-blue hover:text-blue/80"
                        >
                          {battle.title}
                        </Button>
                        <ExternalLink className="h-3 w-3 text-muted-foreground hidden sm:inline-block" />
                      </div>
                      <div className="block sm:hidden mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          battle.type === 'private' ? 'bg-purple/30 text-purple' : 'bg-green-500/30 text-green-600'
                        }`}>
                          {battle.type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getBattleStatusDisplay(battle.status, participantsCount)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-night-600">
                      {battle.created_at ? formatDistanceToNow(new Date(battle.created_at), { addSuffix: true }) : 'N/A'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        battle.type === 'private' ? 'bg-purple/30 text-purple' : 'bg-green-500/30 text-green-600'
                      }`}>
                        {battle.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="sm:hidden"
                          onClick={() => {
                            if (battle.status === 'waiting') {
                              navigate(`/battles/waiting/${battle.id}`);
                            } else {
                              navigate(`/battles/${battle.id}`);
                            }
                          }}
                        >
                          <ExternalLink className="h-4 w-4 text-blue" />
                        </Button>
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
                      </div>
                      <div className="block md:hidden text-xs text-night-600 mt-1">
                        {getBattleStatusDisplay(battle.status, participantsCount)}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserBattlesList;
