import { Link } from "react-router";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";

export function Footer() {
  const { lang } = useApp();

  const links = [
    { path: "/", label: t("home", lang) },
    { path: "/rankings", label: t("rankings", lang) },
    { path: "/matches", label: t("matches", lang) },
  ];

  return (
    <footer className="bg-[#1A2332] text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-lg font-bold">EFL</span>
            <span className="block text-xs text-gray-400">Electronic Future League</span>
          </div>
          <div className="flex items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-700 text-center text-xs text-gray-500">
          &copy; 2025 EFL. {t("footerRights", lang)}.
        </div>
      </div>
    </footer>
  );
}
