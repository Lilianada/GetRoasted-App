
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink } from "lucide-react";
import BattleStatusIndicator from './BattleStatusIndicator';
import DeleteBattleDialog from './DeleteBattleDialog';

interface BattleTableRowProps {
  battle: any;
  deletingId: string | null;
  onDeleteBattle: (battleId: string) => Promise<void>;
}

const BattleTableRow = ({ battle, deletingId, onDeleteBattle }: BattleTableRowProps) => {
  const navigate = useNavigate();
  const participantsCount = battle.battle_participants?.length || 0;
  
  const handleRowNavigation = () => {
    if (battle.status === 'waiting') {
      navigate(`/battles/waiting/${battle.id}`);
    } else {
      navigate(`/battles/${battle.id}`);
    }
  };

  return (
    <TableRow 
      key={battle.id} 
      className="hover:bg-purple/20 transition-colors border-b border-black/20 last:border-0"
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <Button 
            variant="link" 
            onClick={handleRowNavigation}
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
        <BattleStatusIndicator status={battle.status} participantsCount={participantsCount} />
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
            onClick={handleRowNavigation}
          >
            <ExternalLink className="h-4 w-4 text-blue" />
          </Button>
          <DeleteBattleDialog 
            isDeleting={deletingId === battle.id}
            onDelete={() => onDeleteBattle(battle.id)}
          />
        </div>
        <div className="block md:hidden text-xs text-night-600 mt-1">
          <BattleStatusIndicator status={battle.status} participantsCount={participantsCount} />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default BattleTableRow;
