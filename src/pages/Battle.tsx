
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "@/components/ui/loader";
import { BattleProvider, useBattleContext } from "@/context/BattleContext";
import BattleArenaContainer from "@/components/battle/BattleArenaContainer";
import BattleChatPanel from "./BattleChatPanel";
import BattlePresenceManager from "@/components/BattlePresenceManager";
import GetReadyModal from "@/components/battle/GetReadyModal";

// Main container component
const BattleContainer = () => {
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [showReadyModal, setShowReadyModal] = useState(true);
  
  const { 
    participants, 
    spectatorCount, 
    setSpectatorCount, 
    setBattleState, 
    isLoading, 
    error, 
    isSpectator, 
    battleId,
    battleState
  } = useBattleContext();

  useEffect(() => {
    // Only show the ready modal once when the battle is ready
    if (battleState === 'ready') {
      setShowReadyModal(true);
    }
  }, [battleState]);

  const handleBothPlayersReady = () => {
    // Once both players are ready, close the modal and start the battle
    setShowReadyModal(false);
    setBattleState('active');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[300px]"><Loader size="large" variant="colorful" /></div>;
  }
  
  if (error) {
    return <div className="text-center text-red-500 py-12">Failed to load battle data.</div>;
  }

  const handleSendChat = () => {
    // Chat send functionality would go here
    console.log('Sending chat message:', chatInput);
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-night flex flex-col">
      <BattlePresenceManager 
        battleId={battleId || ''}
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
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleSendChat={handleSendChat}
            showChat={showChat}
            isSpectator={isSpectator}
          />
        </div>
      </main>

      {/* Get Ready Modal */}
      {!isSpectator && (
        <GetReadyModal
          open={showReadyModal}
          onOpenChange={setShowReadyModal}
          battleId={battleId || ''}
          participantCount={participants.length}
          onBothPlayersReady={handleBothPlayersReady}
        />
      )}
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
