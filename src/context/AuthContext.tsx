import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  billing?: {
    subscriptionStatus: string;
    subscriptionPriceId: string | null;
    currentPeriodEnd: string | null;
    credits: {
      included: number;
      used: number;
      remaining: number;
    };
  };
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateRole: (role: "user" | "admin") => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void checkAuth();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login: async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        setUser(data.user);
      },
      register: async (name, email, password) => {
        const { data } = await api.post("/auth/register", {
          name,
          email,
          password,
        });
        setUser(data.user);
      },
      logout: async () => {
        await api.post("/auth/logout");
        setUser(null);
      },
      updateRole: async (role) => {
        const { data } = await api.patch("/auth/role", { role });
        setUser(data.user);
      },
    }),
    [isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
