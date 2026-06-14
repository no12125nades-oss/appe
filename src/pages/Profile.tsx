import { useNavigate } from "react-router";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";
import { trpc } from "@/providers/trpc";
import { User, Trophy, Swords, TrendingUp, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const navigate = useNavigate();
  const { lang, user, logout } = useApp();
  const { data: teams } = trpc.teams.list.useQuery({});

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">{t("signIn", lang)}</h2>
        <p className="text-sm text-gray-500 mb-4">Please sign in to view your profile</p>
        <Button onClick={() => navigate("/")} className="bg-[#E8751A] hover:bg-[#D46615] text-white">
          {t("home", lang)}
        </Button>
      </div>
    );
  }

  const u = user as Record<string, any>;
  const userTeam = teams?.find((t) => t.id === u.teamId);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A2332] to-[#2A3A4E] px-6 py-8 text-center">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
            <User className="w-10 h-10 text-white/80" />
          </div>
          <h1 className="text-2xl font-bold text-white">{user.username}</h1>
          <p className="text-sm text-gray-300 mt-1">{u.email || "user@efl.gg"}</p>
          <span className="inline-block mt-2 px-3 py-0.5 bg-[#E8751A] text-white text-xs font-medium rounded-full">
            {user.role === "admin" ? "Administrator" : "Player"}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-100 dark:border-[#333]">
          <div className="text-center">
            <Swords className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-lg font-bold text-[#1A2332] dark:text-white">{u.matchesPlayed || 0}</p>
            <p className="text-[11px] text-gray-500">{t("matchesPlayed", lang)}</p>
          </div>
          <div className="text-center">
            <Trophy className="w-5 h-5 mx-auto text-yellow-500 mb-1" />
            <p className="text-lg font-bold text-[#1A2332] dark:text-white">{u.wins || 0}</p>
            <p className="text-[11px] text-gray-500">{t("wins", lang)}</p>
          </div>
          <div className="text-center">
            <TrendingUp className="w-5 h-5 mx-auto text-green-500 mb-1" />
            <p className="text-lg font-bold text-[#1A2332] dark:text-white">{(u.rating || 1.0).toFixed(2)}</p>
            <p className="text-[11px] text-gray-500">{t("rating", lang)}</p>
          </div>
        </div>

        {/* Team */}
        {userTeam && (
          <div className="p-6 border-b border-gray-100 dark:border-[#333]">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">{t("team", lang)}</h3>
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#252525] rounded-lg p-4">
              <img src={userTeam.logoUrl} alt={userTeam.name} className="w-14 h-14 object-contain" />
              <div>
                <p className="text-base font-bold text-[#1A2332] dark:text-white">{userTeam.name}</p>
                <p className="text-xs text-gray-500">{userTeam.region} — {userTeam.tier}</p>
                <p className="text-xs text-gray-400 mt-1">{userTeam.points} points</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6">
          <Button
            onClick={logout}
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t("signOut", lang)}
          </Button>
        </div>
      </div>
    </div>
  );
}
