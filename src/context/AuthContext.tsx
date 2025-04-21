
import { createContext, useContext, ReactNode } from 'react';
import useAuth from '@/hooks/useAuth';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string, username: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { useMemo, useEffect } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  // Memoize the context value
  const memoizedAuth = useMemo(() => auth, [auth.user, auth.loading, auth.session]);

  // Store last path in localStorage on route change
  useEffect(() => {
    const updateLastPath = () => {
      window.localStorage.setItem('lastPath', window.location.pathname);
    };
    window.addEventListener('popstate', updateLastPath);
    window.addEventListener('pushstate', updateLastPath);
    window.addEventListener('replacestate', updateLastPath);
    updateLastPath();
    return () => {
      window.removeEventListener('popstate', updateLastPath);
      window.removeEventListener('pushstate', updateLastPath);
      window.removeEventListener('replacestate', updateLastPath);
    };
  }, []);

  return <AuthContext.Provider value={memoizedAuth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
