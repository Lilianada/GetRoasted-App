
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuthContext } from "@/context/AuthContext";
import { Loader } from "@/components/ui/loader";
import BattleTableRow from './BattleTableRow';
import EmptyBattlesList from './EmptyBattlesList';
import { useUserBattles } from '@/hooks/battle/useUserBattles';

const UserBattlesList = () => {
  const { user } = useAuthContext();
  const { battles, loading, deletingId, handleDeleteBattle } = useUserBattles(user?.id);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader size="large" />
      </div>
    );
  }

  if (battles.length === 0) {
    return <EmptyBattlesList />;
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
              {battles.map((battle) => (
                <BattleTableRow 
                  key={battle.id}
                  battle={battle}
                  deletingId={deletingId}
                  onDeleteBattle={handleDeleteBattle}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserBattlesList;
