import { Link, useLocation } from "react-router";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";
import { Sun, Moon, User, LogOut, Shield, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  const { theme, toggleTheme, lang, setLang, user, isAdmin, logout } = useApp();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { path: "/", label: t("home", lang) },
    { path: "/rankings", label: t("rankings", lang) },
    { path: "/matches", label: t("matches", lang) },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-[#333] transition-colors duration-300">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 shrink-0">
          <span className="text-xl font-bold text-[#1A2332] dark:text-white tracking-tight">
            EFL
          </span>
          <span className="hidden sm:block text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
            Electronic Future League
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1 sm:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-1 py-4 text-sm font-medium transition-colors duration-200 ${
                location.pathname === link.path
                  ? "text-[#1A2332] dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-[#1A2332] dark:hover:text-white"
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8751A]" />
              )}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={`relative px-1 py-4 text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                location.pathname === "/admin"
                  ? "text-[#1A2332] dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-[#1A2332] dark:hover:text-white"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("admin", lang)}</span>
              {location.pathname === "/admin" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8751A]" />
              )}
            </Link>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="hidden sm:flex items-center gap-0.5">
            {(["en", "ru", "uk"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-1.5 py-1 text-xs font-medium rounded transition-colors ${
                  lang === l
                    ? "text-[#E8751A]"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Auth */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              >
                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">
                  {user.username}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-lg shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333]"
                  >
                    <User className="w-4 h-4" />
                    {t("myProfile", lang)}
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333]"
                    >
                      <Shield className="w-4 h-4" />
                      {t("adminPanel", lang)}
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-[#333] w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("signOut", lang)}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={onLoginClick}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#E8751A] transition-colors"
              >
                {t("signIn", lang)}
              </button>
              <button
                onClick={onRegisterClick}
                className="px-3 py-1.5 text-sm font-medium bg-[#E8751A] text-white rounded-md hover:bg-[#D46615] transition-colors"
              >
                {t("register", lang)}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
