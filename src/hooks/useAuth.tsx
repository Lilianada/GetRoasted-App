import { useState, useEffect, useMemo } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';
import { toast } from "@/components/ui/sonner";
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
  
        // Only redirect if user just signed in and is on / or /signup
        if (event === 'SIGNED_IN') {
          const currentPath = window.location.pathname;
          if (currentPath === '/' || currentPath === '/signup') {
            navigate('/battles', { replace: true });
          }
        }
  
        // Redirect unauthenticated users to home if they try to access protected routes
        if (event === 'SIGNED_OUT') {
          const currentPath = window.location.pathname;
          if (
            currentPath !== '/' &&
            currentPath !== '/signup' &&
            currentPath !== '/terms' &&
            currentPath !== '/privacy'
          ) {
            navigate('/');
          }
        }
      }
    );
  
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
  
      // Only redirect if user is authenticated and on / or /signup
      if (session) {
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '/signup') {
          navigate('/battles', { replace: true });
        }
      }
    });
  
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out", {
        description: error.message
      });
      throw error;
    }
    navigate('/');
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  };

  const signUpWithEmail = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || `user_${Math.random().toString(36).substring(7)}`
        }
      }
    });
    
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/battles'
      }
    });
    
    if (error) throw error;
    return data;
  };

  const deleteAccount = async () => {
    if (!user) {
      toast.error("You need to be logged in to delete your account");
      return;
    }
    
    try {
      // Call the Supabase function to delete the user's account
      // Corrected: send user_id (snake_case) as expected by the Edge Function
      const { error } = await supabase.functions.invoke('delete-account', {
        body: { user_id: user.id } 
      });
      
      if (error) throw error;
      
      // Sign out after deletion
      await signOut(); // signOut already navigates to '/'
      toast.success("Account deleted successfully");
      // navigate('/'); // Not needed here as signOut handles it
    } catch (error: any) {
      toast.error("Failed to delete account", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
      throw error;
    }
  };

  // Memoize the returned object for context stability
  return useMemo(() => ({
    session,
    user,
    loading,
    signOut,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    deleteAccount
  }), [session, user, loading, signOut, signInWithEmail, signUpWithEmail, signInWithGoogle, deleteAccount]); // Ensure all dependencies are listed for useMemo
};

export default useAuth;
