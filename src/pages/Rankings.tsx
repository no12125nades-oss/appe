import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";
import { trpc } from "@/providers/trpc";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  Target,
  Users,
  Shield,
  Crosshair,
  Eye,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Tab = "teams" | "players";
type Tier = "All" | "Tier 1" | "Tier 2" | "Tier 3";
type Role = "All" | "AWPer" | "Entry" | "IGL" | "Lurk" | "Support";

const tierColors: Record<string, string> = {
  "Tier 1": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Tier 2": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  "Tier 3": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

const roleColors: Record<string, string> = {
  AWPer: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Entry: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  IGL: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Lurk: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Support: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const roleIcons: Record<string, React.ReactNode> = {
  AWPer: <Crosshair className="w-3.5 h-3.5" />,
  Entry: <Target className="w-3.5 h-3.5" />,
  IGL: <Shield className="w-3.5 h-3.5" />,
  Lurk: <Eye className="w-3.5 h-3.5" />,
  Support: <Users className="w-3.5 h-3.5" />,
};

export default function Rankings() {
  const { lang } = useApp();
  const [tab, setTab] = useState<Tab>("teams");
  const [tier, setTier] = useState<Tier>("All");
  const [role, setRole] = useState<Role>("All");
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  const { data: teams } = trpc.teams.list.useQuery(tier !== "All" ? { tier } : undefined);
  const { data: players } = trpc.players.list.useQuery(
    tier !== "All" || role !== "All" ? { tier: tier !== "All" ? tier : undefined, role: role !== "All" ? role : undefined } : undefined
  );

  const { data: teamDetail } = trpc.teams.getWithRoster.useQuery(
    { id: selectedTeam! },
    { enabled: !!selectedTeam }
  );
  const { data: playerDetail } = trpc.players.getWithTeam.useQuery(
    { id: selectedPlayer! },
    { enabled: !!selectedPlayer }
  );

  const sortedTeams = [...(teams || [])].sort((a, b) => b.points - a.points);
  const sortedPlayers = [...(players || [])].sort((a, b) => b.rating - a.rating);
  const topTeams = sortedTeams.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A2332] dark:text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-[#E8751A]" />
          {t("rankings", lang)}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t("worldRanking", lang)} — Week 42
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-200 dark:border-[#333]">
        <button
          onClick={() => setTab("teams")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "teams"
              ? "border-[#E8751A] text-[#1A2332] dark:text-white"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          {t("teams", lang)}
        </button>
        <button
          onClick={() => setTab("players")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "players"
              ? "border-[#E8751A] text-[#1A2332] dark:text-white"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          {t("players", lang)}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="lg:w-56 shrink-0 space-y-4">
          {/* Tier Filter */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg p-4 shadow-sm">
            <h3 className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-3">
              {t("allTiers", lang)}
            </h3>
            <div className="space-y-1.5">
              {(["All", "Tier 1", "Tier 2", "Tier 3"] as Tier[]).map((tierItem) => (
                <button
                  key={tierItem}
                  onClick={() => setTier(tierItem)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    tier === tierItem
                      ? "bg-[#E8751A] text-white"
                      : "bg-gray-50 dark:bg-[#252525] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333]"
                  }`}
                >
                  {tierItem !== "All" && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tierItem === "Tier 1" ? "bg-yellow-400" : tierItem === "Tier 2" ? "bg-gray-400" : "bg-amber-600"
                      }`}
                    />
                  )}
                  {tierItem === "All" ? t("allTiers", lang) : t(tierItem.toLowerCase().replace(" ", ""), lang)}
                </button>
              ))}
            </div>
          </div>

          {/* Role Filter (players only) */}
          <AnimatePresence>
            {tab === "players" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white dark:bg-[#1E1E1E] rounded-lg p-4 shadow-sm"
              >
                <h3 className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-3">
                  {t("roles", lang)}
                </h3>
                <div className="space-y-1.5">
                  {(["All", "AWPer", "Entry", "IGL", "Lurk", "Support"] as Role[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        role === r
                          ? "bg-[#E8751A] text-white"
                          : "bg-gray-50 dark:bg-[#252525] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333]"
                      }`}
                    >
                      {r !== "All" && roleIcons[r]}
                      {r === "All" ? t("allRoles", lang) : t(r.toLowerCase(), lang)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {tab === "teams" ? (
              <motion.div
                key="teams"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Spotlight */}
                {tier === "All" && topTeams.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-4 mb-6 snap-x">
                    {topTeams.map((team, i) => (
                      <div
                        key={team.id}
                        onClick={() => setSelectedTeam(team.id)}
                        className="shrink-0 w-36 bg-white dark:bg-[#1E1E1E] rounded-lg p-4 shadow-sm text-center cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all snap-start"
                      >
                        <img src={team.logoUrl} alt={team.name} className="w-16 h-16 object-contain mx-auto mb-2" />
                        <span
                          className={`text-2xl font-bold ${
                            i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-500"
                          }`}
                        >
                          #{i + 1}
                        </span>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1 truncate">{team.name}</p>
                        <p className="text-xs text-gray-500">{team.points} pts</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full ${tierColors[team.tier]}`}>
                          {team.tier}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Teams Table */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-[#333]">
                          <th className="px-4 py-3 text-left">{t("pos", lang)}</th>
                          <th className="px-4 py-3 text-left">{t("team", lang)}</th>
                          <th className="px-4 py-3 text-right">{t("points", lang)}</th>
                          <th className="px-4 py-3 text-center">{t("trend", lang)}</th>
                          <th className="px-4 py-3 text-center">{t("tier", lang)}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedTeams.map((team, i) => (
                          <tr
                            key={team.id}
                            onClick={() => setSelectedTeam(team.id)}
                            className="border-b border-gray-100 dark:border-[#333] last:border-0 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors cursor-pointer"
                          >
                            <td className="px-4 py-3">
                              <span
                                className={`font-bold ${
                                  i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-500"
                                }`}
                              >
                                {i + 1}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={team.logoUrl} alt={team.name} className="w-8 h-8 object-contain" />
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{team.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-semibold">{team.points}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                {team.trend > 0 ? (
                                  <>
                                    <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                                    <span className="text-xs text-green-500">+{team.trend}</span>
                                  </>
                                ) : team.trend < 0 ? (
                                  <>
                                    <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                                    <span className="text-xs text-red-500">{team.trend}</span>
                                  </>
                                ) : (
                                  <Minus className="w-3.5 h-3.5 text-gray-400" />
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full ${tierColors[team.tier]}`}>
                                {team.tier}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="players"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Players Table */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-[#333]">
                          <th className="px-4 py-3 text-left">{t("pos", lang)}</th>
                          <th className="px-4 py-3 text-left">{t("players", lang)}</th>
                          <th className="px-4 py-3 text-left">{t("team", lang)}</th>
                          <th className="px-4 py-3 text-center">{t("role", lang)}</th>
                          <th className="px-4 py-3 text-right">{t("rating", lang)}</th>
                          <th className="px-4 py-3 text-center">{t("tier", lang)}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedPlayers.map((player, i) => {
                          const team = teams?.find((t) => t.id === player.teamId);
                          return (
                            <tr
                              key={player.id}
                              onClick={() => setSelectedPlayer(player.id)}
                              className="border-b border-gray-100 dark:border-[#333] last:border-0 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors cursor-pointer"
                            >
                              <td className="px-4 py-3">
                                <span
                                  className={`font-bold ${
                                    i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-500"
                                  }`}
                                >
                                  {i + 1}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={player.avatarUrl || "/player-1.png"}
                                    alt={player.nickname}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{player.nickname}</p>
                                    <p className="text-[11px] text-gray-500">{player.nationality}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                {team && (
                                  <div className="flex items-center gap-2">
                                    <img src={team.logoUrl} alt={team.name} className="w-5 h-5 object-contain" />
                                    <span className="text-xs text-gray-600 dark:text-gray-400">{team.name}</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full ${roleColors[player.role]}`}>
                                  {roleIcons[player.role]}
                                  {player.role}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className={`text-sm font-semibold ${player.rating >= 1.2 ? "text-[#E8751A]" : "text-gray-700 dark:text-gray-300"}`}>
                                  {player.rating.toFixed(2)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full ${tierColors[player.tier]}`}>
                                  {player.tier}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Team Detail Dialog */}
      <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333] max-h-[85vh] overflow-y-auto">
          {teamDetail && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <img src={teamDetail.logoUrl} alt={teamDetail.name} className="w-16 h-16 object-contain" />
                  <div>
                    <DialogTitle className="text-xl font-bold text-[#1A2332] dark:text-white">
                      {teamDetail.name}
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{teamDetail.region}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${tierColors[teamDetail.tier]}`}>
                        {teamDetail.tier}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                <div className="bg-gray-50 dark:bg-[#252525] rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">{t("matchesPlayed", lang)}</p>
                  <p className="text-lg font-bold text-[#1A2332] dark:text-white">{teamDetail.matchesPlayed}</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#252525] rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">{t("winRate", lang)}</p>
                  <p className="text-lg font-bold text-green-600">
                    {teamDetail.matchesPlayed > 0 ? Math.round((teamDetail.wins / teamDetail.matchesPlayed) * 100) : 0}%
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-[#252525] rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">{t("points", lang)}</p>
                  <p className="text-lg font-bold text-[#E8751A]">{teamDetail.points}</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#252525] rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">{t("worldRanking", lang)}</p>
                  <p className="text-lg font-bold text-[#1A2332] dark:text-white">#{teamDetail.worldRank || "-"}</p>
                </div>
              </div>

              {/* Roster */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-[#1A2332] dark:text-white mb-3">{t("roster", lang)}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {teamDetail.roster?.map((p: any) => (
                    <div
                      key={p.id}
                      onClick={() => { setSelectedTeam(null); setTimeout(() => setSelectedPlayer(p.id), 100); }}
                      className="bg-gray-50 dark:bg-[#252525] rounded-lg p-3 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                    >
                      <img
                        src={p.avatarUrl || "/player-1.png"}
                        alt={p.nickname}
                        className="w-14 h-14 rounded-full object-cover mx-auto mb-2"
                      />
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{p.nickname}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full mt-1 ${roleColors[p.role]}`}>
                        {p.role}
                      </span>
                      <p className={`text-sm font-semibold mt-1 ${p.rating >= 1.2 ? "text-[#E8751A]" : "text-gray-600 dark:text-gray-400"}`}>
                        {p.rating.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Player Detail Dialog */}
      <Dialog open={!!selectedPlayer} onOpenChange={() => setSelectedPlayer(null)}>
        <DialogContent className="max-w-lg bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333]">
          {playerDetail && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <img
                    src={playerDetail.avatarUrl || "/player-1.png"}
                    alt={playerDetail.nickname}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <DialogTitle className="text-xl font-bold text-[#1A2332] dark:text-white">
                      {playerDetail.nickname}
                    </DialogTitle>
                    <p className="text-sm text-gray-500">{playerDetail.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{playerDetail.nationality}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full ${roleColors[playerDetail.role]}`}>
                        {playerDetail.role}
                      </span>
                    </div>
                    {playerDetail.team && (
                      <div className="flex items-center gap-2 mt-1">
                        <img src={playerDetail.team.logoUrl} alt={playerDetail.team.name} className="w-4 h-4 object-contain" />
                        <span className="text-xs text-[#E8751A]">{playerDetail.team.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </DialogHeader>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-gray-50 dark:bg-[#252525] rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">{t("rating", lang)}</p>
                  <p className={`text-xl font-bold ${playerDetail.rating >= 1.2 ? "text-[#E8751A]" : "text-[#1A2332] dark:text-white"}`}>
                    {playerDetail.rating.toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-[#252525] rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">{t("kdRatio", lang)}</p>
                  <p className="text-xl font-bold text-[#1A2332] dark:text-white">{playerDetail.kdRatio.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#252525] rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">{t("adr", lang)}</p>
                  <p className="text-xl font-bold text-[#1A2332] dark:text-white">{playerDetail.adr.toFixed(1)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#252525] rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">{t("kast", lang)}</p>
                  <p className="text-xl font-bold text-[#1A2332] dark:text-white">{playerDetail.kast.toFixed(1)}%</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#252525] rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">{t("mapsPlayed", lang)}</p>
                  <p className="text-xl font-bold text-[#1A2332] dark:text-white">{playerDetail.mapsPlayed}</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#252525] rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">{t("mvpCount", lang)}</p>
                  <p className="text-xl font-bold text-yellow-500 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4" />
                    {playerDetail.mvpCount}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
