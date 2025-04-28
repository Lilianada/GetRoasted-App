
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BattleStatusBadgeProps {
  status: 'waiting' | 'ready' | 'active' | 'completed';
  className?: string;
}

const BattleStatusBadge = ({ status, className }: BattleStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'waiting':
        return {
          label: 'Waiting for Players',
          className: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
        };
      case 'ready':
        return {
          label: 'Ready to Start',
          className: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
        };
      case 'active':
        return {
          label: 'Battle in Progress',
          className: 'bg-green-500/10 text-green-600 border-green-500/20'
        };
      case 'completed':
        return {
          label: 'Battle Ended',
          className: 'bg-purple-500/10 text-purple-600 border-purple-500/20'
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-500/10 text-gray-600 border-gray-500/20'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium ml-auto", config.className, className)}
    >
      {config.label}
    </Badge>
  );
};

export default BattleStatusBadge;
