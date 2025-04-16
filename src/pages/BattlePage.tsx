
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import BattleSpectateView from "@/components/BattleSpectateView";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Flame, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";

const BattlePage = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isParticipant, setIsParticipant] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkParticipation = async () => {
      if (!battleId || !user) return;
      
      try {
        const { data, error } = await supabase
          .from('battle_participants')
          .select('*')
          .eq('battle_id', battleId)
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        setIsParticipant(!!data);
        setLoading(false);
      } catch (error) {
        console.error('Error checking participation:', error);
        toast.error("Failed to check battle participation");
        setLoading(false);
      }
    };
    
    checkParticipation();
  }, [battleId, user]);
  
  const handleJoinBattle = () => {
    navigate(`/battle/live/${battleId}`);
  };
  
  if (!battleId) {
    return <div>Invalid battle ID</div>;
  }
  
  return (
    <div className="min-h-screen bg-night flex flex-col">
      <NavBar />
      
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2"
            onClick={() => navigate('/battles')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Battles
          </Button>
          
          {isParticipant && (
            <Button 
              className="gap-2 bg-gradient-flame hover:opacity-90"
              onClick={handleJoinBattle}
            >
              <Flame className="h-4 w-4" />
              Join Battle
            </Button>
          )}
        </div>
        
        <BattleSpectateView battleId={battleId} />
      </div>
    </div>
  );
};

export default BattlePage;
