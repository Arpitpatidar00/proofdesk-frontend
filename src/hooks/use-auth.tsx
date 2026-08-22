"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User, UserRole } from "@/types";

const FIXED_USERS: Record<UserRole, User> = {
  REVIEWER: { email: "reviewer@proofdesk.local", role: "REVIEWER" },
  VIEWER: { email: "viewer@proofdesk.local", role: "VIEWER" },
};

interface AuthContextType {
  user: User;
  switchRole: (role: UserRole) => void;
  isReviewer: boolean;
  isViewer: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("REVIEWER");

  // Load from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("proofdesk-role") as UserRole;
    if (savedRole && FIXED_USERS[savedRole]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRole(savedRole);
    }
  }, []);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem("proofdesk-role", newRole);
  };

  const user = FIXED_USERS[role];

  return (
    <AuthContext.Provider
      value={{
        user,
        switchRole,
        isReviewer: role === "REVIEWER",
        isViewer: role === "VIEWER",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
