
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PricingCard from "@/components/PricingCard";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PricingSection = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  
  // Fetch user's subscription status
  useState(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        if (data) setCurrentPlan(data.subscription_tier);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  const handleUpgrade = (plan: string) => {
    if (!user) {
      navigate('/signup');
      return;
    }
    
    navigate('/billing', { state: { selectedPlan: plan } });
  };
  
  const freePlanFeatures = [
    { name: "Join public battles", included: true },
    { name: "Create up to 3 battles per day", included: true },
    { name: "Spectate unlimited battles", included: true },
    { name: "Basic profile customization", included: true },
    { name: "Community leaderboard access", included: true },
    { name: "Limited roast analytics", included: false },
    { name: "Exclusive flame effects", included: false },
    { name: "AI-suggested comebacks", included: false }
  ];
  
  const proPlanFeatures = [
    { name: "Join unlimited battles", included: true },
    { name: "Create unlimited battles", included: true },
    { name: "Spectate unlimited battles", included: true },
    { name: "Advanced profile customization", included: true },
    { name: "Premium leaderboard stats", included: true },
    { name: "Comprehensive roast analytics", included: true },
    { name: "All flame effects and animations", included: true },
    { name: "AI-suggested comebacks", included: true }
  ];

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Choose Your Plan</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the perfect tier for your roasting abilities, from casual burns to professional flame-throwing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingCard 
            title="Free Roaster"
            price="Free"
            description="Perfect for casual burn enthusiasts who want to test the waters"
            features={freePlanFeatures}
            buttonText="Current Plan"
            onButtonClick={() => handleUpgrade('free')}
            currentPlan={currentPlan === 'free'}
          />
          
          <PricingCard 
            title="Pro Roaster"
            price="$9.99"
            description="For serious flame throwers who want the complete experience"
            features={proPlanFeatures}
            buttonText="Upgrade Now"
            popular={true}
            onButtonClick={() => handleUpgrade('pro')}
            currentPlan={currentPlan === 'pro'}
          />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
