import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';
import { useSettings } from "@/hooks/useSettings";
import { toast } from "@/components/ui/sonner";
import { Loader } from "@/components/ui/loader";

const NavBar = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { playSound } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
      setIsLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast.success("Logged out successfully", {
        description: "See you next time!"
      });
      playSound('success');
      
      navigate('/');
    } catch (error) {
      playSound('error');
      toast.error("Logout Failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsLoading(false);
      setIsOpen(false); // Make sure menu closes after sign out
    }
  };

  const handleMenuPress = () => {
    setIsOpen(!isOpen); // Toggle the isOpen state
  };

  return (
    <header className="neo-nav w-full border-b-2 border-black bg-night-900 backdrop-blur-md sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90 z-20">
          <div className="relative h-8 w-8 border-2 border-black p-1 bg-flame-500 neo-shadow neo-hover">
            <Flame className="h-6 w-6 text-black animate-flame-pulse" />
          </div>
          <span className="font-geist text-xl font-black tracking-tighter">
            <span className="text-flame-500">Get</span>
            <span className="text-ember-500">Roasted</span>
          </span>
        </Link>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="neo-button p-2 menu-button"
              onClick={handleMenuPress}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] bg-night-800 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] menu-content">
            <SheetHeader className="border-b-2 border-black pb-4">
              <VisuallyHidden>
                <DialogTitle>Navigation Menu</DialogTitle>
              </VisuallyHidden>
              <div className="flex items-center gap-2">
                <div className="bg-flame-500 p-1 border-2 border-black">
                  <Flame className="h-6 w-6 text-black" />
                </div>
                <span className="font-geist text-lg font-black tracking-tighter">
                  <span className="text-flame-500">Get</span>
                  <span className="text-ember-500">Roasted</span>
                </span>
              </div>
            </SheetHeader>

            <nav className="mt-6 flex flex-col gap-3">

              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader variant="colorful" />
                </div>
              ) : session ? (
                <>
                  <SheetClose asChild>
                    <Link to="/battles" className="neo-button w-full text-center p-2">
                      Battles
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/battles/new" className="neo-button w-full text-center p-2 bg-primary">
                      Start Battle
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/profile" className="neo-button w-full text-center p-2">
                      Profile
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/leaderboard" className="neo-button w-full text-center p-2">
                      Leaderboard
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/rules" className="neo-button w-full text-center p-2">
                      Rules
                    </Link>
                  </SheetClose>
                  
                  
                  <SheetClose asChild>
                    <Link to="/settings" className="neo-button w-full text-center p-2">
                      Settings
                    </Link>
                  </SheetClose>
                  <button 
                    onClick={handleSignOut}
                    className="neo-button w-full p-2 bg-red-500 text-white hover:bg-red-600 absolute bottom-1 left-0"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader size="small" /> : "Sign Out"}
                  </button>
                </>
              ) : (
                <SheetClose asChild>
                  <Link to="/signup" className="neo-button w-full text-center p-2 bg-primary">
                    Get Started
                  </Link>
                </SheetClose>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default NavBar;
