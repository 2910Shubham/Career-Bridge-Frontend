import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User interface as provided
export interface User {
  userId: string;
  fullname: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  phoneNumber?: string;
  location?: string;
  bio?: string;
  companyName?: string;
  designation?: string;
  companyDescription?: string;
  companyWebsite?: string;
  achievements?: Array<{
    title?: string;
    description?: string;
    date?: string;
    category?: string;
    icon?: string;
  }>;
  education?: Array<any>;
  experience?: Array<any>;
  studentInfo?: any;
  recruiterInfo?: any;
  skills?: string[];
  posts?: Array<any>;
  preferences?: any;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info from backend on mount
  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.data || data.user || null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        await refreshUser();
        return true;
      } else {
        setUser(null);
        setLoading(false);
        return false;
      }
    } catch {
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}; 