"use client";
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  currentUser: any;
  setCurrentUser: (value: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  React.useEffect(() => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    setCurrentUser(user);
  }, []);

  return (
    <AuthContext.Provider
      value={{ authenticated, setAuthenticated, currentUser, setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
