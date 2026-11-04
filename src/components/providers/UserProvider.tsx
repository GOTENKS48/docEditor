"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

interface UserContextType {
  currentUser: MockUser;
  allUsers: MockUser[];
  isLoading: boolean;
  switchUser: (userId: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const defaultUser: MockUser = {
  id: "usr_alex",
  name: "Alex Rivera",
  email: "alex@ajaia.internal",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80",
};

const UserContext = createContext<UserContextType>({
  currentUser: defaultUser,
  allUsers: [defaultUser],
  isLoading: true,
  switchUser: async () => {},
  refreshUsers: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<MockUser>(defaultUser);
  const [allUsers, setAllUsers] = useState<MockUser[]>([defaultUser]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUserState = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.currentUser) setCurrentUser(data.currentUser);
        if (data.allUsers) setAllUsers(data.allUsers);
      }
    } catch (err) {
      console.error("Failed to load user state:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserState();
  }, [fetchUserState]);

  const switchUser = async (userId: string) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/switch-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to switch user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        allUsers,
        isLoading,
        switchUser,
        refreshUsers: fetchUserState,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
