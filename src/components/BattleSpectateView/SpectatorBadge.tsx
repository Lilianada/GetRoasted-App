import React from "react";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface SpectatorBadgeProps {
  spectators: number;
}

const SpectatorBadge: React.FC<SpectatorBadgeProps> = ({ spectators }) => (
  <Badge variant="outline" className="flex items-center gap-1">
    <Users className="h-3 w-3" />
    <span>{spectators}</span>
  </Badge>
);

export default SpectatorBadge;
