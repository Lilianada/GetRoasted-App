
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { User, AtSign, Lock } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import GoogleButton from "./GoogleButton";
import AuthDivider from "./AuthDivider";
import PasswordInput from "./PasswordInput";

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle } = useAuthContext();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signUpWithEmail(email, password, username);
      
      toast.success("Account Created", {
        description: "Welcome to GetRoasted! Please check your email to verify your account."
      });
      
      navigate('/battles');
    } catch (error) {
      toast.error("Sign Up Failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Redirect happens automatically via options.redirectTo
    } catch (error) {
      toast.error("Google Sign In Failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <GoogleButton onClick={handleGoogleSignIn} label="Sign up with Google" />
          
          <AuthDivider text="Or with email" />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="FlameThrow3r"
                  className="pl-9 border-night-700 focus-visible:ring-flame-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-9 border-night-700 focus-visible:ring-flame-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <PasswordInput 
                  id="signup-password"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <Button 
          type="submit" 
          className="w-full bg-gradient-flame hover:opacity-90"
        >
          Create Account
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link to="/terms" className="text-flame-500 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-flame-500 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </CardFooter>
    </form>
  );
};

export default SignupForm;
