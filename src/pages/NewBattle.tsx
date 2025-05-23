
import { useState } from "react";
import { BattleCreationForm } from "@/components/battle/BattleCreationForm";
import { BattleSidebar } from "@/components/battle/BattleSidebar";

const NewBattle = () => {
  const [showCopied, setShowCopied] = useState(false);
  const [battleId, setBattleId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  
  const handleCopyLink = () => {
    if (!inviteCode) return;
    
    navigator.clipboard.writeText(inviteCode);
    
    setShowCopied(true);
    setTimeout(() => {
      setShowCopied(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-night flex flex-col">
      <main className="container flex-1 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Battle</h1>
          <p className="text-muted-foreground">Set up your roast battle parameters</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BattleCreationForm 
              setBattleId={setBattleId}
              setInviteCode={setInviteCode}
            />
          </div>
          
          <BattleSidebar 
            battleId={battleId}
            inviteCode={inviteCode}
            showCopied={showCopied}
            handleCopyLink={handleCopyLink}
          />
        </div>
      </main>
    </div>
  );
};

export default NewBattle;
