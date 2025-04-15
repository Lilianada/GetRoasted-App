
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Mic,
  LogIn,
  Bell,
  Menu,
  X,
  Home,
  Trophy,
  BookOpen,
  User
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

const NavBar = () => {
  const isMobile = useIsMobile();
  const [notifications, setNotifications] = useState(3);

  const handleNotificationClick = () => {
    toast("Notifications", {
      description: "You have 3 new battle invitations",
    });
    setNotifications(0);
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

        {!isMobile ? (
          <>
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-flame-500">
                Home
              </Link>
              <Link to="/battles" className="text-sm font-medium text-muted-foreground transition-colors hover:text-flame-500">
                Battles
              </Link>
              <Link to="/leaderboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-flame-500">
                Leaderboard
              </Link>
              <Link to="/rules" className="text-sm font-medium text-muted-foreground transition-colors hover:text-flame-500">
                Rules
              </Link>
            </nav>

            <div className="flex items-center gap-3">
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
              <Button variant="outline" asChild className="gap-2">
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
              <Button asChild className="gap-2 bg-gradient-flame hover:opacity-90">
                <Link to="/battle/new">
                  <Mic className="h-4 w-4" />
                  <span>Start Battle</span>
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
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
                  </nav>
                  
                  <div className="space-y-3 pt-4">
                    <SheetClose asChild>
                      <Button variant="outline" asChild className="w-full gap-2">
                        <Link to="/login">
                          <LogIn className="h-4 w-4" />
                          <span>Sign In</span>
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild className="w-full gap-2 bg-gradient-flame hover:opacity-90">
                        <Link to="/battle/new">
                          <Mic className="h-4 w-4" />
                          <span>Start Battle</span>
                        </Link>
                      </Button>
                    </SheetClose>
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
