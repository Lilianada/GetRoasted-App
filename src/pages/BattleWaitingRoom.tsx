
import { useParams, useNavigate } from "react-router-dom";
import Loader from "@/components/ui/loader";
import BattlePresenceManager from "@/components/BattlePresenceManager";
import GetReadyModal from "@/components/battle/GetReadyModal";
import { useBattleWaitingRoom } from "@/hooks/battle/useBattleWaitingRoom";
import BattleWaitingLayout from "@/components/battle/BattleWaitingRoom/BattleWaitingLayout";

const BattleWaitingRoom = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const navigate = useNavigate();
  
  const {
    battleData,
    participants,
    loading,
    showGetReadyModal,
    countdown,
    spectatorCount,
    setShowGetReadyModal,
    setSpectatorCount,
    handleInviteContacts,
    handleEnterBattleRoom,
    handleBattleStateChange,
    handleBothPlayersReady
  } = useBattleWaitingRoom(battleId);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-night flex flex-col">
        <main className="container flex-1 py-8 flex items-center justify-center">
          <Loader size="large" variant="colorful" />
        </main>
      </div>
    );
  }
  
  if (!battleData) {
    return (
      <div className="min-h-screen bg-night flex flex-col">
        <div className="container py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Battle Not Found</h2>
            <p className="text-muted-foreground mb-6">The battle you're looking for doesn't exist or has been deleted.</p>
            <button onClick={() => navigate('/battles')}>
              Return to Battles
            </button>
          </div>
        </div>
      </div>
    );
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
          onGetReadyModal={handleBothPlayersReady}
          maxParticipants={2}
        />
      )}
      
      <div className="container py-8">      
        <BattleWaitingLayout 
          title={battleData.title}
          participants={participants}
          inviteCode={battleData.invite_code || '------'}
          timePerTurn={battleData.time_per_turn || 180}
          battleId={battleId || ''}
          onInviteContacts={handleInviteContacts}
          onBothPlayersReady={handleBothPlayersReady}
          onBack={() => navigate('/battles')}
          onEnterBattle={handleEnterBattleRoom}
        />
      </div>
      
      {/* Get Ready Modal component */}
      <GetReadyModal 
        open={showGetReadyModal} 
        onOpenChange={setShowGetReadyModal}
        battleId={battleId || ''}
        participantCount={participants.length}
        countdown={countdown}
      />
    </div>
  );
};

export default BattleWaitingRoom;
