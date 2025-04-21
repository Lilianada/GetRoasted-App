
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PricingCard from "@/components/PricingCard";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PricingSection = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  
  useEffect(() => {
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
    { name: "Spectate up to 3 battles per day", included: true },
    { name: "Limited roast analytics", included: false },
    { name: "AI-suggested comebacks", included: false }
  ];
  
  const proPlanFeatures = [
    { name: "Join unlimited battles", included: true },
    { name: "Create unlimited battles", included: true },
    { name: "Spectate unlimited battles", included: true },
    { name: "Comprehensive roast analytics", included: true },
    { name: "AI-suggested comebacks", included: true }
  ];

  return (
    <section className="py-16 bg-night">
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
            buttonText={currentPlan === 'free' ? "Current Plan" : "Choose Free"}
            onSubscribe={() => handleUpgrade('free')}
            isPopular={false}
          />
          
          <PricingCard 
            title="Pro Roaster"
            price="$9.99"
            description="For serious flame throwers who want the complete experience"
            features={proPlanFeatures}
            buttonText={currentPlan === 'pro' ? "Current Plan" : "Upgrade Now"}
            onSubscribe={() => handleUpgrade('pro')}
            isPopular={true}
          />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
