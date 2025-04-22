
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/context/AuthContext';

export function useSubscriptionLimits() {
  const { user } = useAuthContext();
  const [limits, setLimits] = useState({
    maxBattlesPerDay: 3,
    maxSpectatePerDay: 10,
    currentBattlesCreated: 0,
    currentBattlesSpectated: 0,
    isPro: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLimits = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        // Set default values based on subscription tier
        const isPro = data?.subscription_tier === 'pro';
        
        // For now, just set default values
        // In a real implementation, we would track usage in the database
        setLimits({
          maxBattlesPerDay: isPro ? 20 : 3,
          maxSpectatePerDay: isPro ? 50 : 10,
          currentBattlesCreated: 0,
          currentBattlesSpectated: 0,
          isPro,
        });
      } catch (error) {
        console.error('Error fetching subscription limits:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLimits();
  }, [user]);
  
  return { limits, isLoading };
}
