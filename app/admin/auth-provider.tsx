"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

// Admin password - replace with an environment variable in production
const ADMIN_PASSWORD = "fulshear2024";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check for existing auth on mount
  useEffect(() => {
    const authStatus = localStorage.getItem("admin-auth");
    if (authStatus === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);
  
  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("admin-auth", "authenticated");
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin-auth");
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 