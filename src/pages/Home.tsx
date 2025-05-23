import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import BattleCard from "@/components/BattleCard";
import PricingSection from "@/components/PricingSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, User, Users, Timer, Crown, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";

const Home = () => {
  const { user } = useAuthContext();
  const [battles, setBattles] = useState<any[]>([]);

  useEffect(() => {
    const fetchBattles = async () => {
      try {
        const { data, error } = await supabase
          .from('battles')
          .select('*, profiles(username, avatar_url)')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        
        setBattles(data || []);
      } catch (error) {
        console.error('Error fetching battles:', error);
      }
    };

    fetchBattles();
  }, []);

  return (
    <div className="min-h-screen bg-night flex flex-col">
      
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-flame-500/10 via-transparent to-transparent" />
          
          <div className="container relative">
            <div className="flex flex-col items-center gap-8 text-center">
              <div className="relative inline-block animate-flame-pulse">
                <Flame className="h-20 w-20 text-flame-600" />
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight lg:text-5xl max-w-2xl">
                Epic <span className="gradient-text">Roast Battles</span> in Real-Time
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl">
                GetRoasted is the premier platform for gamified verbal duels 
                where you can showcase your wit and compete for social clout.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                {user ? (
                  <Button asChild size="lg" className="gap-2 bg-yellow hover:opacity-90">
                    <Link to="/battles/new">
                      Start a Battle
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="gap-2 bg-yellow hover:opacity-90">
                    <Link to="/signup">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                
                <Button asChild size="lg" variant="outline" className="border-night-700 gap-2">
                  <Link to={user ? "/battles" : "/signup"}>
                    Watch Battles
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gradient-to-b from-transparent to-night-900">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                GetRoasted brings structure and competition to the art of roasting with 
                time-bound verbal duels and community voting.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
              <div className=" flex flex-col items-center text-center p-6">
                <div className="h-12 w-12 bg-yellow rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Join a Battle</h3>
                <p className="text-muted-foreground">
                  Choose a quick match or create a private room to battle with friends.
                </p>
              </div>
              
              <div className=" flex flex-col items-center text-center p-6">
                <div className="h-12 w-12 bg-yellow rounded-full flex items-center justify-center mb-4">
                  <Timer className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Time-bound Rounds</h3>
                <p className="text-muted-foreground">
                  3 minutes per round, 3 rounds per battle. Think fast and be witty.
                </p>
              </div>
              
              <div className=" flex flex-col items-center text-center p-6">
                <div className="h-12 w-12 bg-yellow rounded-full flex items-center justify-center mb-4">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Get Voted</h3>
                <p className="text-muted-foreground">
                  Spectators vote on creativity, humor and savagery to determine the winner.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Plans Section */}
        <PricingSection />
        
        {/* Live Battles Section */}
        <section className="py-16">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Live Battles</h2>
              <Button asChild variant="ghost" className="text-muted-foreground">
                <Link to={user ? "/battles" : "/signup"} className="flex items-center gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {battles.length > 0 ? (
                battles.map((battle) => (
                  <BattleCard key={battle.id} {...battle} />
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-muted-foreground">No active battles at the moment. Be the first to start one!</p>
                  <Button asChild className="mt-4 bg-yellow hover:opacity-90">
                    <Link to={user ? "/battles/new" : "/signup"}>Start a Battle</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-b from-night-900 to-night-800">
          <div className="container">
            <div className=" p-8 lg:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Roasted?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Sign up now to join the ultimate verbal battleground. Show off your wit, 
                earn badges, and climb the ranks of roast royalty.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {user ? (
                  <Button asChild size="lg" className="gap-2 bg-yellow hover:opacity-90">
                    <Link to="/battles/new">
                      <Sparkles className="h-4 w-4" />
                      Start Battle
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="gap-2 bg-yellow hover:opacity-90">
                    <Link to="/signup">
                      <User className="h-4 w-4" />
                      Sign Up Free
                    </Link>
                  </Button>
                )}
                <Button asChild size="lg" variant="outline" className="border-night-700 gap-2">
                  <Link to={user ? "/battles" : "/signup"}>
                    <Sparkles className="h-4 w-4" />
                    Browse Battles
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-night-900 border-t border-night-800 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-flame-600" />
              <span className="font-geist text-lg font-bold">
                <span className="text-flame-500">Get</span>
                <span className="text-ember-500">Roasted</span>
              </span>
            </div>
            
            <nav className="flex items-center gap-6">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-flame-500">
                About
              </Link>
              <Link to="/rules" className="text-sm text-muted-foreground hover:text-flame-500">
                Rules
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-flame-500">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-flame-500">
                Terms
              </Link>
            </nav>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} GetRoasted. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
