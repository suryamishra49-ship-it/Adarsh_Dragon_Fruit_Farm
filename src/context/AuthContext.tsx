import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Sync with existing app logic that uses localStorage
        const SUPER_ADMIN_EMAIL = 'surya.mishra49@gmail.com';
        const verifiedAdmins = JSON.parse(localStorage.getItem('verified_admins') || '[]');
        const isVerifiedAdmin = verifiedAdmins.includes(session.user.email);
        const isSuperAdmin = session.user.email === SUPER_ADMIN_EMAIL;
        const role = (isSuperAdmin || isVerifiedAdmin) ? 'admin' : 'user';

        const userData = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || (isSuperAdmin ? 'Super Admin' : 'Farmer'),
          email: session.user.email,
          loginId: session.user.email,
          role: role,
          notifications: []
        };

        // Preserve notifications if they exist in users_db
        const usersDb = JSON.parse(localStorage.getItem('users_db') || '[]');
        const existing = usersDb.find((u: any) => u.loginId === session.user?.email);
        if (existing) userData.notifications = existing.notifications || [];

        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
