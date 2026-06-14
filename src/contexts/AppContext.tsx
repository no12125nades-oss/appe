import { createContext, useContext, type ReactNode } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useSiteAuth } from "@/hooks/useSiteAuth";
import type { Lang } from "@/lib/translations";

interface AppContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  user: { id: number; username: string; role: string } | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (data: { username: string; password: string }) => void;
  register: (data: { username: string; email: string; password: string }) => void;
  logout: () => void;
  loginError: string | undefined;
  registerError: string | undefined;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const auth = useSiteAuth();

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        setLang,
        user: auth.user,
        isAdmin: auth.isAdmin,
        isLoading: auth.isLoading,
        login: auth.login,
        register: auth.register,
        logout: auth.logout,
        loginError: auth.loginError,
        registerError: auth.registerError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
