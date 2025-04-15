
import { useState, useEffect, createContext, useContext, ReactNode } from "react";

// Define subscription plan types
export type SubscriptionPlan = 'free' | 'pro';

// Define subscription context interface
interface SubscriptionContextType {
  plan: SubscriptionPlan;
  isPro: boolean;
  maxCharacters: number;
  canUseVoiceRecording: boolean;
  canCreatePrivateBattles: boolean;
  canUseAdvancedFeatures: boolean;
  checkFeatureAccess: (feature: string) => boolean;
  // In a real app with Supabase, we would add methods to update subscription
}

// Create default context values
const defaultSubscriptionContext: SubscriptionContextType = {
  plan: 'free',
  isPro: false,
  maxCharacters: 280,
  canUseVoiceRecording: false,
  canCreatePrivateBattles: false,
  canUseAdvancedFeatures: false,
  checkFeatureAccess: () => false
};

// Create context
const SubscriptionContext = createContext<SubscriptionContextType>(defaultSubscriptionContext);

// Provider component
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  // In a real app, we would fetch this from Supabase
  const [plan, setPlan] = useState<SubscriptionPlan>('free');
  
  const isPro = plan === 'pro';
  
  // Plan-specific feature values
  const maxCharacters = isPro ? 700 : 280;
  const canUseVoiceRecording = isPro;
  const canCreatePrivateBattles = isPro;
  const canUseAdvancedFeatures = isPro;
  
  // Feature access checking function
  const checkFeatureAccess = (feature: string): boolean => {
    switch(feature) {
      case 'voice_recording':
        return canUseVoiceRecording;
      case 'private_battles':
        return canCreatePrivateBattles;
      case 'advanced_features':
        return canUseAdvancedFeatures;
      default:
        return true; // Default to true for basic features
    }
  };
  
  // We would update this effect to fetch from Supabase in a real implementation
  useEffect(() => {
    // Simulate fetching subscription data
    const fetchSubscription = async () => {
      try {
        // This would be a Supabase query in a real app
        // const { data, error } = await supabase.from('subscriptions').select('*').eq('user_id', userId).single();
        
        // For now, just using localStorage as a mock
        const storedPlan = localStorage.getItem('subscription_plan') as SubscriptionPlan || 'free';
        setPlan(storedPlan);
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
        setPlan('free'); // Default to free on error
      }
    };
    
    fetchSubscription();
  }, []);
  
  const value = {
    plan,
    isPro,
    maxCharacters,
    canUseVoiceRecording,
    canCreatePrivateBattles,
    canUseAdvancedFeatures,
    checkFeatureAccess
  };
  
  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

// Custom hook to use the subscription context
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  
  return context;
}
