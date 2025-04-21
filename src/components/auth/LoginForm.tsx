
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Mail, Lock } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import GoogleButton from "./GoogleButton";
import AuthDivider from "./AuthDivider";
import PasswordInput from "./PasswordInput";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle } = useAuthContext();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signInWithEmail(email, password);
      
      toast.success("Login Successful", {
        description: "Welcome back to GetRoasted!"
      });
      
      navigate('/battles');
    } catch (error) {
      toast.error("Login Failed", {
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
    <form onSubmit={handleSignIn}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <GoogleButton onClick={handleGoogleSignIn} label="Sign in with Google" />
          
          <AuthDivider text="Or continue with" />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-flame-500 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <PasswordInput 
                  id="password"
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
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-yellow hover:opacity-90"
        >
          Sign In
        </Button>
      </CardFooter>
    </form>
  );
};

export default LoginForm;
