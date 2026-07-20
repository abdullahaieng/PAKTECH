"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { PublicUser } from "@/types";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { firebaseSignOut } from "@/lib/firebase/auth-actions";

interface AuthContextValue {
  user: PublicUser | null;
  loading: boolean;
  firebaseEnabled: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const firebaseEnabled = isFirebaseConfigured();

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setUser(json.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const logout = useCallback(async () => {
    if (firebaseEnabled) {
      try {
        await firebaseSignOut();
      } catch {
        await fetch("/api/auth/logout", { method: "POST" });
      }
    } else {
      await fetch("/api/auth/logout", { method: "POST" });
    }
    setUser(null);
    window.location.href = "/account/login";
  }, [firebaseEnabled]);

  useEffect(() => {
    if (!firebaseEnabled) {
      refresh().finally(() => setLoading(false));
      return;
    }

    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      try {
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken();
          await fetch("/api/auth/firebase/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });
        } else {
          await fetch("/api/auth/logout", { method: "POST" });
        }
        await refresh();
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [firebaseEnabled, refresh]);

  return (
    <AuthContext.Provider value={{ user, loading, firebaseEnabled, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
