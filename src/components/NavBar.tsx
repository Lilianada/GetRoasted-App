
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Mic,
  Bell,
  Menu,
  X,
  Home,
  Trophy,
  BookOpen,
  User,
  Settings,
  LogOut
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import UserMenu from "@/components/UserMenu";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';

const NavBar = () => {
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  // Responsive breakpoint for mobile/tablet menu
  const isMobileOrTablet = window.innerWidth < 900;

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
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

  const handleNotificationClick = () => {
    toast("Notifications", {
      description: "You have 3 new battle invitations",
    });
    setNotifications(0);
  };
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast.success("Logged out successfully", {
        description: "See you next time!"
      });
      
      navigate('/');
    } catch (error) {
      toast.error("Logout Failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-night-800 bg-night/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <div className="relative h-8 w-8">
              <Flame className="h-8 w-8 text-flame-600 animate-flame-pulse" />
            </div>
            <span className="font-geist text-xl font-bold">
              <span className="text-flame-500">Get</span>
              <span className="text-ember-500">Roasted</span>
            </span>
          </Link>
        </div>

        {!isMobileOrTablet ? (
          <>
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-flame-500">
                Home
              </Link>
              {session && (
                <>
                  <Link to="/battles" className="text-sm font-medium text-muted-foreground transition-colors hover:text-flame-500">
                    Battles
                  </Link>
                  <Link to="/leaderboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-flame-500">
                    Leaderboard
                  </Link>
                  <Link to="/rules" className="text-sm font-medium text-muted-foreground transition-colors hover:text-flame-500">
                    Rules
                  </Link>
                </>
              )}
            </nav>

            <div className="flex items-center gap-3">
              {session ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground relative"
                    onClick={handleNotificationClick}
                  >
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {notifications}
                      </Badge>
                    )}
                  </Button>
                  <UserMenu user={{ 
                    name: user?.user_metadata.username || user?.email || 'User', 
                    avatar: user?.user_metadata.avatar_url,
                    isAdmin: user?.user_metadata.is_admin 
                  }} />
                  <Button asChild className="gap-2 bg-gradient-flame hover:opacity-90">
                    <Link to="/battle/new">
                      <Mic className="h-4 w-4" />
                      <span>Start Battle</span>
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild className="gap-2 bg-gradient-flame hover:opacity-90">
                    <Link to="/signup">
                      <User className="h-4 w-4" />
                      <span>Get Started</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            {session && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground relative"
                onClick={handleNotificationClick}
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-night-800 border-night-700">
                <div className="flex flex-col space-y-6 pt-6">
                  <div className="flex items-center gap-2">
                    <Flame className="h-6 w-6 text-flame-600" />
                    <span className="font-geist text-lg font-bold">
                      <span className="text-flame-500">Get</span>
                      <span className="text-ember-500">Roasted</span>
                    </span>
                  </div>
                  <nav className="flex flex-col gap-4">
                    <SheetClose asChild>
                      <Link to="/" className="flex items-center gap-3 py-2 text-base text-muted-foreground hover:text-flame-500">
                        <Home className="h-5 w-5" />
                        <span>Home</span>
                      </Link>
                    </SheetClose>
                    
                    {session ? (
                      <>
                        <SheetClose asChild>
                          <Link to="/battles" className="flex items-center gap-3 py-2 text-base text-muted-foreground hover:text-flame-500">
                            <Mic className="h-5 w-5" />
                            <span>Battles</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to="/leaderboard" className="flex items-center gap-3 py-2 text-base text-muted-foreground hover:text-flame-500">
                            <Trophy className="h-5 w-5" />
                            <span>Leaderboard</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to="/rules" className="flex items-center gap-3 py-2 text-base text-muted-foreground hover:text-flame-500">
                            <BookOpen className="h-5 w-5" />
                            <span>Rules</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to="/profile" className="flex items-center gap-3 py-2 text-base text-muted-foreground hover:text-flame-500">
                            <User className="h-5 w-5" />
                            <span>Profile</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to="/settings" className="flex items-center gap-3 py-2 text-base text-muted-foreground hover:text-flame-500">
                            <Settings className="h-5 w-5" />
                            <span>Settings</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <button 
                            className="flex items-center gap-3 py-2 text-base text-destructive hover:text-destructive/80"
                            onClick={handleSignOut}
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Sign Out</span>
                          </button>
                        </SheetClose>
                      </>
                    ) : (
                      <SheetClose asChild>
                        <Link to="/signup" className="flex items-center gap-3 py-2 text-base text-muted-foreground hover:text-flame-500">
                          <User className="h-5 w-5" />
                          <span>Get Started</span>
                        </Link>
                      </SheetClose>
                    )}
                  </nav>
                  
                  <div className="space-y-3 pt-4">
                    {session ? (
                      <SheetClose asChild>
                        <Button asChild className="w-full gap-2 bg-gradient-flame hover:opacity-90">
                          <Link to="/battle/new">
                            <Mic className="h-4 w-4" />
                            <span>Start Battle</span>
                          </Link>
                        </Button>
                      </SheetClose>
                    ) : (
                      <SheetClose asChild>
                        <Button asChild className="w-full gap-2 bg-gradient-flame hover:opacity-90">
                          <Link to="/signup">
                            <User className="h-4 w-4" />
                            <span>Get Started</span>
                          </Link>
                        </Button>
                      </SheetClose>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
