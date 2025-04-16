
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Shield,
  Flame
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

interface UserMenuProps {
  user?: {
    name: string;
    avatar?: string;
    isAdmin?: boolean;
  } | null;
}

const UserMenu = ({ user: propUser }: UserMenuProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();
  
  const isLoggedIn = !!user;
  
  // Use prop user if provided, otherwise use auth context user
  const displayUser = propUser || {
    name: user?.user_metadata?.username || user?.email?.split('@')[0] || 'User',
    avatar: user?.user_metadata?.avatar_url,
    isAdmin: user?.user_metadata?.is_admin
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  if (!isLoggedIn) {
    return (
      <Link to="/signup" className="flex items-center gap-2 rounded-full bg-night-800 px-3 py-2 text-sm hover:bg-night-700">
        <User className="h-4 w-4 text-flame-500" />
        <span>Get Started</span>
      </Link>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full bg-night-800 pl-2 pr-3 py-1 text-sm hover:bg-night-700">
          <Avatar className="h-7 w-7 border border-night-700">
            <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
            <AvatarFallback className="bg-night-700 text-flame-500">
              {displayUser.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{displayUser.name}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-night-800 border-night-700">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-night-700" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex cursor-pointer items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex cursor-pointer items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-flame-500" />
            <span className="text-flame-500">Pro Roaster</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        {displayUser.isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-night-700" />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/admin" className="flex cursor-pointer items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-500" />
                  <span>Admin Panel</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        
        <DropdownMenuSeparator className="bg-night-700" />
        <DropdownMenuItem 
          className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
