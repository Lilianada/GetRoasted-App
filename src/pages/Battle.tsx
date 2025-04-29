
import { useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "@/components/ui/loader";
import { BattleProvider, useBattleContext } from "@/context/BattleContext";
import BattleArenaContainer from "@/components/battle/BattleArenaContainer";
import BattleChatPanel from "./BattleChatPanel";
import BattlePresenceManager from "@/components/BattlePresenceManager";

// Main container component
const BattleContainer = () => {
  const [showChat, setShowChat] = useState(false);
  const { spectatorCount, setSpectatorCount, setBattleState, isLoading, error } = useBattleContext();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[300px]"><Loader size="large" variant="colorful" /></div>;
  }
  
  if (error) {
    return <div className="text-center text-red-500 py-12">Failed to load battle data.</div>;
  }

  return (
    <div className="min-h-screen bg-night flex flex-col">
      <BattlePresenceManager 
        battleId={useBattleContext().battleId || ''}
        onParticipantCountChange={() => {}}
        onSpectatorCountChange={setSpectatorCount}
        onBattleStateChange={setBattleState}
      />
      
      <main className="container flex-1 py-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <BattleArenaContainer
            showChat={showChat}
            setShowChat={setShowChat}
          />
          
          <BattleChatPanel
            spectatorCount={spectatorCount}
            chatInput={''}
            setChatInput={() => {}}
            handleSendChat={() => {}}
            showChat={showChat}
            isSpectator={useBattleContext().isSpectator}
          />
        </div>
      </main>
    </div>
  );
};

// Entry point component
const Battle = () => {
  const { battleId } = useParams<{ battleId: string }>();

  return (
    <BattleProvider battleId={battleId}>
      <BattleContainer />
    </BattleProvider>
  );
};

export default Battle;
