
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Flame, Mic, LogIn, Bell } from "lucide-react";

const NavBar = () => {
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

        <nav className="hidden md:flex items-center gap-6">
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
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
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
      </div>
    </header>
  );
};

export default NavBar;
