import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/providers/trpc";

interface AuthUser {
  id: number;
  username: string;
  email?: string;
  role: string;
  teamId?: number | null;
  rating?: number;
  matchesPlayed?: number;
  wins?: number;
}

export function useSiteAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("efl_token"));
  const [user, setUser] = useState<AuthUser | null>(null);

  const meQuery = trpc.siteAuth.me.useQuery(
    token ? { token } : undefined,
    { enabled: !!token, retry: false }
  );

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data);
    } else if (meQuery.isError) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("efl_token");
    }
  }, [meQuery.data, meQuery.isError]);

  const loginMutation = trpc.siteAuth.login.useMutation({
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("efl_token", data.token);
    },
  });

  const registerMutation = trpc.siteAuth.register.useMutation({
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("efl_token", data.token);
    },
  });

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("efl_token");
  }, []);

  const isAdmin = user?.role === "admin";

  return {
    user,
    token,
    isAdmin,
    isLoading: meQuery.isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
  };
}
