
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import Loader from "@/components/ui/loader";
import { useParams } from "react-router-dom";
import { useBattle, useBattleParticipants, useSpectatorCount } from "@/hooks/useBattleData";
import BattleArena from "./BattleArena";
import BattleChatPanel from "./BattleChatPanel";

const Battle = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const [roastInput, setRoastInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [isSpectator, setIsSpectator] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Fetch battle data
  const { data: battle, isLoading: battleLoading, error: battleError } = useBattle(battleId);
  const { data: participants = [], isLoading: participantsLoading } = useBattleParticipants(battleId);
  const { data: spectatorCount = 0, isLoading: spectatorLoading } = useSpectatorCount(battleId);

  // Wait for all data to load
  const loading = battleLoading || participantsLoading || spectatorLoading;

  if (loading) {
    return <div className="flex justify-center items-center min-h-[300px]"><Loader size="large" variant="colorful" /></div>;
  }
  if (battleError || !battle) {
    return <div className="text-center text-red-500 py-12">Failed to load battle data.</div>;
  }

  // Example: currentUserId from participants (replace with real auth logic)
  const currentUserId = participants[0]?.id || "";

  // Example: timeRemaining from battle (you may want to implement timer logic)
  // TODO: Implement timer logic based on battle's timing fields if available
const [timeRemaining, setTimeRemaining] = useState<number | undefined>(undefined);

  // ...rest of component logic and rendering using battle, participants, spectatorCount, etc.

  
  const handleSendRoast = () => {
    if (roastInput.trim() === "") return;
    
    toast.success("Roast submitted!");
    setRoastInput("");
  };
  
  const handleSendChat = () => {
    if (chatInput.trim() === "") return;
    
    toast.success("Message sent!");
    setChatInput("");
  };
  
  const handleReaction = (roastId: string, reaction: string) => {
    toast(`You reacted with ${reaction}`, {
      duration: 1500,
    });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  
  const totalTime = 60;
  const timePercentage = timeRemaining !== undefined ? (timeRemaining / totalTime) * 100 : 100;
  
  const isPlayerTurn = () => {
    // TODO: Implement real turn logic when available
    return false;
  };

  return (
    <div className="min-h-screen bg-night flex flex-col">
      <main className="container flex-1 py-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <BattleArena
            participants={participants}
            spectatorCount={spectatorCount}
            roastInput={roastInput}
            setRoastInput={setRoastInput}
            isSpectator={isSpectator}
            showChat={showChat}
            setShowChat={setShowChat}
            timeRemaining={timeRemaining ?? 60}
            timePercentage={timePercentage}
            formatTime={formatTime}
            isPlayerTurn={isPlayerTurn}
            handleSendRoast={handleSendRoast}
          />
          <BattleChatPanel
            spectatorCount={spectatorCount}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleSendChat={handleSendChat}
            showChat={showChat}
          />
        </div>
      </main>
    </div>
  );
};

export default Battle;
