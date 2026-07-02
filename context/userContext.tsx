"use client";
import { createContext, useContext, useState, useEffect } from "react";

type User = {
  userId: number;
  email: string;
  name: string;
  role: "admin" | "viewer";
} | null;

type UserContextType = {
  user: User;
  loading: boolean;
  logOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    setUser(data.user);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const logOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, logOut, refresh }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUser debe usarse dentro de un UserProvider");
  return context;
}
