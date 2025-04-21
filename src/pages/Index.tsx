
import { useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Flame, Trophy, MessageSquare, Users, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { session } = useAuth();
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const features = [
    { 
      id: "battles",
      title: "Epic Roast Battles",
      description: "Challenge friends or strangers to hilarious verbal duels",
      icon: <Flame className="h-8 w-8 text-accent" />,
      color: "bg-accent"
    },
    {
      id: "leaderboards",
      title: "Global Leaderboards",
      description: "Climb the ranks and become the ultimate roast champion",
      icon: <Trophy className="h-8 w-8 text-primary" />,
      color: "bg-primary"
    },
    {
      id: "community",
      title: "Growing Community",
      description: "Join thousands of roasters from around the world",
      icon: <Users className="h-8 w-8 text-blue" />,
      color: "bg-blue"
    },
    {
      id: "rewards",
      title: "Earn Rewards",
      description: "Win battles to unlock exclusive content and badges",
      icon: <Sparkles className="h-8 w-8 text-[#C5B4F0]" />,
      color: "bg-[#C5B4F0]"
    }
  ];

  return (
    <div className="min-h-screen bg-night">
      {/* Hero Section */}
      <section className="neo-section relative overflow-hidden">
        <div className="neo-container py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="text-left space-y-6">
              <div className="inline-block -rotate-2 px-4 py-2 bg-[#F8C537] border-2 border-black mb-4">
                <h2 className="text-black font-black">BATTLE. ROAST. WIN.</h2>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tighter mb-4">
                The Ultimate<br/>
                <span className="text-flame-500">Roast</span> 
                <span className="text-ember-500">Battle</span> 
                <br/>Platform
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 font-medium max-w-lg">
                Challenge friends to epic roast battles, climb the leaderboards,
                and prove you have the sharpest wit in the room.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-6">
                {!session ? (
                  <Link to="/signup">
                    <Button className="neo-button text-lg px-10 py-6">
                      Get Started
                    </Button>
                  </Link>
                ) : (
                  <Link to="/battle/new">
                    <Button className="neo-button text-lg px-10 py-6">
                      Start A Battle
                    </Button>
                  </Link>
                )}
                
                <Link to="/rules">
                  <Button variant="outline" className="text-lg border-2 border-white hover:bg-yellow-500 hover:text-flame-500 py-6">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="neo-card-yellow transform rotate-3 hover:rotate-0 transition-all p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 bg-flame-500 neo-badge flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-black text-black">Sick Burns Only</h3>
                </div>
                
                <p className="text-black font-medium">"Your jokes are so old, archeologists carbon-dated them to the Jurassic period."</p>
                
                <div className="flex justify-between items-center pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 bg-black rounded-full needs-radius flex items-center justify-center text-white font-bold">JT</div>
                    <div className="text-sm text-black font-bold">@jokester</div>
                  </div>
                  
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-black fill-black" />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-8 -right-8 neo-card-purple transform -rotate-2 hover:rotate-0 transition-all p-5">
                <p className="text-black font-bold">300+ Active Battles</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <Breadcrumbs />
      <section className="neo-section py-16 relative">
        <div className="neo-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black">
              How <span className="text-flame-500">Get</span><span className="text-ember-500">Roasted</span> Works
            </h2>
            <p className="text-xl text-gray-300 font-medium mt-4 max-w-2xl mx-auto">
              Join the community of quick-witted roasters and battle your way to the top.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {features.map((feature) => (
              <div 
                key={feature.id}
                className={`${feature.color} border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 transition-all p-6 neo-tilt ${hoveredFeature === feature.id ? "neo-wiggle" : ""}`}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="h-16 w-16 bg-black border-2 border-black mb-4 p-3">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-black mb-2">{feature.title}</h3>
                <p className="text-black/80 font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
          
          {!session && (
            <div className="text-center mt-16">
              <Link to="/signup">
                <Button className="neo-button text-xl px-10 py-6">
                  Join The Community
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="neo-container">
          <div className="bg-[#F8C537] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 neo-tilt-reverse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-black mb-4">Ready To Get Roasted?</h2>
                <p className="text-lg text-black/80 font-medium mb-6">
                  Join thousands of roasters and put your comedy skills to the test.
                </p>
                <Link to={session ? "/battle/new" : "/signup"}>
                  <Button className="neo-button bg-black text-white px-10 py-5 text-lg">
                    {session ? "Start A Battle" : "Create Free Account"}
                  </Button>
                </Link>
              </div>
              
              <div className="relative h-full flex justify-center items-center">
                <div className="h-32 w-32 bg-black border-2 border-black flex items-center justify-center">
                  <Flame className="h-20 w-20 text-[#F97316] animate-flame-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Star = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default Index;
