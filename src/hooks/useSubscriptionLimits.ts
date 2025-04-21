
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

export function useSubscriptionLimits() {
  const { isPro } = useSubscription();
  const navigate = useNavigate();
  const [dailyBattlesCreated, setDailyBattlesCreated] = useState(0);
  const [dailyBattlesSpectated, setDailyBattlesSpectated] = useState(0);

  // Fetch current limits on mount
  useEffect(() => {
    const fetchLimits = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('daily_battles_created, daily_battles_spectated')
        .single();

      if (profile) {
        setDailyBattlesCreated(profile.daily_battles_created);
        setDailyBattlesSpectated(profile.daily_battles_spectated);
      }
    };

    fetchLimits();
  }, []);

  const checkCanCreateBattle = () => {
    if (isPro) return true;
    if (dailyBattlesCreated >= 3) {
      toast.error("Daily battle creation limit reached", {
        description: "Upgrade to Pro to create unlimited battles!",
        action: {
          label: "Upgrade",
          onClick: () => navigate('/billing')
        }
      });
      return false;
    }
    return true;
  };

  const checkCanSpectateBattle = () => {
    if (isPro) return true;
    if (dailyBattlesSpectated >= 3) {
      toast.error("Daily spectating limit reached", {
        description: "Upgrade to Pro to spectate unlimited battles!",
        action: {
          label: "Upgrade",
          onClick: () => navigate('/billing')
        }
      });
      return false;
    }
    return true;
  };

  return {
    checkCanCreateBattle,
    checkCanSpectateBattle,
    dailyBattlesCreated,
    dailyBattlesSpectated,
    isPro
  };
}
