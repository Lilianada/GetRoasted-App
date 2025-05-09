
import { useParams } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import BattlePresenceManager from "@/components/BattlePresenceManager";
import GetReadyModal from "@/components/battle/GetReadyModal";
import BattleLoadingState from "@/components/battle/BattleLoadingState";
import BattleWaitingCard from "@/components/battle/BattleWaitingCard";
import { useBattleWaitingRoom } from "@/hooks/battle/useBattleWaitingRoom";

const BattleWaitingRoom = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const { user } = useAuthContext();
  
  const {
    battleData,
    participants,
    loading,
    showGetReadyModal,
    setShowGetReadyModal,
    countdown,
    spectatorCount,
    setSpectatorCount,
    playersReady,
    handleInviteContacts,
    handleEnterBattleRoom,
    handleBattleStateChange,
    handleGetReadyModal,
    handleBothPlayersReady,
    handleEnterBattle
  } = useBattleWaitingRoom(battleId);
  
  if (loading) {
    return <BattleLoadingState />;
  }
  
  if (!battleData) {
    return <BattleLoadingState isError />;
  }
  
  return (
    <div className="min-h-screen bg-night flex flex-col">
      {/* Battle Presence Manager */}
      {battleId && (
        <BattlePresenceManager 
          battleId={battleId}
          onParticipantCountChange={(count) => console.log('Participant count:', count)}
          onSpectatorCountChange={setSpectatorCount}
          onBattleStateChange={handleBattleStateChange}
          onGetReadyModal={handleGetReadyModal}
          maxParticipants={2}
        />
      )}
      
      <div className="container py-8">      
        <BattleWaitingCard 
          battleData={battleData}
          participants={participants}
          onInviteContacts={handleInviteContacts}
          onEnterBattleRoom={handleEnterBattleRoom}
          onBothPlayersReady={handleBothPlayersReady}
        />
      </div>
      
      {/* Get Ready Modal component */}
      <GetReadyModal 
        open={showGetReadyModal} 
        onOpenChange={setShowGetReadyModal}
        countdown={countdown}
        onComplete={handleEnterBattle}
        canProceed={playersReady}
      />
    </div>
  );
};

export default BattleWaitingRoom;
