import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const UserSessionContext = createContext(null);

const STORAGE_KEY = "demoUser";

export function UserSessionProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const value = useMemo(() => {
    return {
      user,
      isLoggedIn: !!user?.userId,
      login: (u) => {
        setUser(u);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      },
      logout: () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
      },
    };
  }, [user]);

  return (
    <UserSessionContext.Provider value={value}>
      {children}
    </UserSessionContext.Provider>
  );
}

export function useUserSession() {
  const ctx = useContext(UserSessionContext);
  if (!ctx) throw new Error("useUserSession must be used inside UserSessionProvider");
  return ctx;
}
