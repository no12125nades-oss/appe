import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "register";
}

export function AuthModal({ open, onOpenChange, defaultTab = "login" }: AuthModalProps) {
  const { lang, login, register, loginError, registerError } = useApp();
  const [tab, setTab] = useState(defaultTab);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (!username || !password) {
      setLocalError(t("fieldRequired", lang));
      return;
    }
    login({ username, password });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (!username || !email || !password) {
      setLocalError(t("fieldRequired", lang));
      return;
    }
    if (password !== confirmPassword) {
      setLocalError(t("passwordsDoNotMatch", lang));
      return;
    }
    register({ username, email, password });
  };

  const error = localError || loginError || registerError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#1A2332] dark:text-white">
            EFL
          </DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-[#252525]">
            <TabsTrigger value="login" className="data-[state=active]:bg-[#E8751A] data-[state=active]:text-white">
              {t("login", lang)}
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-[#E8751A] data-[state=active]:text-white">
              {t("register", lang)}
            </TabsTrigger>
          </TabsList>

          {error && (
            <div className="mt-3 flex items-center gap-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-3 mt-3">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("username", lang)}</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="mt-1 dark:bg-[#252525] dark:border-[#333]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("password", lang)}</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="adminknjazx"
                  className="mt-1 dark:bg-[#252525] dark:border-[#333]"
                />
              </div>
              <Button type="submit" className="w-full bg-[#E8751A] hover:bg-[#D46615] text-white">
                {t("signIn", lang)}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-3 mt-3">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("username", lang)}</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 dark:bg-[#252525] dark:border-[#333]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("email", lang)}</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 dark:bg-[#252525] dark:border-[#333]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("password", lang)}</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 dark:bg-[#252525] dark:border-[#333]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("confirmPassword", lang)}</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 dark:bg-[#252525] dark:border-[#333]"
                />
              </div>
              <Button type="submit" className="w-full bg-[#E8751A] hover:bg-[#D46615] text-white">
                {t("register", lang)}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
