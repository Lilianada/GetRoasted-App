
import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface SocketStatusProps {
  connected?: boolean;
}

const SocketStatus = ({ connected = true }: SocketStatusProps) => {
  const [isConnected, setIsConnected] = useState(connected);
  
  // This is a simulation - in a real app this would connect to actual socket events
  useEffect(() => {
    setIsConnected(connected);
    
    if (!connected) {
      toast.error("Connection lost", {
        description: "Trying to reconnect...",
        duration: 3000,
      });
    }
  }, [connected]);

  if (isConnected) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-destructive px-3 py-1.5 text-white shadow-lg animate-pulse">
      <WifiOff className="h-4 w-4" />
      <span className="text-xs font-medium">Reconnecting...</span>
    </div>
  );
};

export default SocketStatus;
