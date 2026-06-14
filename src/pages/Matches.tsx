import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";
import { trpc } from "@/providers/trpc";
import { motion } from "framer-motion";
import { Swords, Clock, MapPin, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";

type StatusFilter = "all" | "upcoming" | "live" | "finished";

export default function Matches() {
  const { lang } = useApp();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const { data: matches } = trpc.matches.list.useQuery(
    statusFilter !== "all" ? { status: statusFilter } : undefined
  );
  const { data: teams } = trpc.teams.list.useQuery({});
  const { data: matchDetail } = trpc.matches.getById.useQuery(
    { id: selectedMatch! },
    { enabled: !!selectedMatch }
  );

  const getTeam = (id: number) => teams?.find((t) => t.id === id);

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const tomorrow = new Date(now.getTime() + 86400000).toISOString().split("T")[0];
  const yesterday = new Date(now.getTime() - 86400000).toISOString().split("T")[0];

  const groupByDate = (matches: any[]) => {
    const groups: Record<string, any[]> = {};
    matches.forEach((m) => {
      const date = m.scheduledAt.split("T")[0];
      if (!groups[date]) groups[date] = [];
      groups[date].push(m);
    });
    return groups;
  };

  const getDateLabel = (dateStr: string) => {
    if (dateStr === today) return t("today", lang);
    if (dateStr === tomorrow) return t("tomorrow", lang);
    if (dateStr === yesterday) return t("yesterday", lang);
    return new Date(dateStr).toLocaleDateString(lang === "en" ? "en-US" : lang === "ru" ? "ru-RU" : "uk-UA", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    upcoming: { bg: "bg-[#1A2332]", text: "text-white", label: t("upcoming", lang) },
    live: { bg: "bg-red-500 animate-pulse", text: "text-white", label: "LIVE" },
    finished: { bg: "bg-gray-500", text: "text-white", label: t("finished", lang) },
  };

  const filteredMatches = matches || [];
  const grouped = groupByDate(filteredMatches);
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A2332] dark:text-white flex items-center gap-2">
          <Swords className="w-6 h-6 text-[#E8751A]" />
          {t("matches", lang)}
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Status Filter Sidebar */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg p-4 shadow-sm sticky top-20">
            <h3 className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-3">
              {t("status", lang)}
            </h3>
            <div className="space-y-1.5">
              {(["all", "upcoming", "live", "finished"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    statusFilter === s
                      ? "bg-[#E8751A] text-white"
                      : "bg-gray-50 dark:bg-[#252525] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333]"
                  }`}
                >
                  {s !== "all" && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        s === "upcoming" ? "bg-blue-400" : s === "live" ? "bg-red-500 animate-pulse" : "bg-gray-400"
                      }`}
                    />
                  )}
                  {s === "all" ? "All" : t(s, lang)}
                </button>
              ))}
            </div>

            {/* Quick Match Counts */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-[#333]">
              <div className="space-y-2">
                {[
                  { label: t("live", lang), count: filteredMatches.filter((m) => m.status === "live").length, color: "text-red-500" },
                  { label: t("upcoming", lang), count: filteredMatches.filter((m) => m.status === "upcoming").length, color: "text-blue-500" },
                  { label: t("finished", lang), count: filteredMatches.filter((m) => m.status === "finished").length, color: "text-gray-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                    <span className={`font-semibold ${item.color}`}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Match Feed */}
        <div className="flex-1">
          {sortedDates.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <Swords className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{t("noMatches", lang)}</p>
            </div>
          ) : (
            sortedDates.map((date) => (
              <div key={date} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-200 dark:border-[#333]">
                  {getDateLabel(date)}
                </h3>
                <div className="space-y-3">
                  {grouped[date].map((match) => {
                    const teamA = getTeam(match.teamAId);
                    const teamB = getTeam(match.teamBId);
                    if (!teamA || !teamB) return null;
                    const cfg = statusConfig[match.status];
                    return (
                      <motion.div
                        key={match.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-[#1E1E1E] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedMatch(match.id)}
                      >
                        {/* Top Row */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${cfg.bg} ${cfg.text}`}>
                            {cfg.label}
                          </span>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            {match.tournament}
                          </span>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(match.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        {/* Teams */}
                        <div className="flex items-center justify-between">
                          <div
                            className="flex-1 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={(e) => { e.stopPropagation(); setSelectedTeam(teamA.id); }}
                          >
                            <img src={teamA.logoUrl} alt={teamA.name} className="w-10 h-10 object-contain" />
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{teamA.name}</p>
                            </div>
                          </div>

                          <div className="px-6 text-center">
                            {match.status === "upcoming" ? (
                              <span className="text-lg font-bold text-[#1A2332] dark:text-white">
                                VS
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className={`text-2xl font-bold ${match.scoreA > match.scoreB ? "text-[#E8751A]" : "text-gray-500"}`}>
                                  {match.scoreA}
                                </span>
                                <span className="text-gray-400">:</span>
                                <span className={`text-2xl font-bold ${match.scoreB > match.scoreA ? "text-[#E8751A]" : "text-gray-500"}`}>
                                  {match.scoreB}
                                </span>
                              </div>
                            )}
                          </div>

                          <div
                            className="flex-1 flex items-center gap-3 justify-end cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={(e) => { e.stopPropagation(); setSelectedTeam(teamB.id); }}
                          >
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{teamB.name}</p>
                            </div>
                            <img src={teamB.logoUrl} alt={teamB.name} className="w-10 h-10 object-contain" />
                          </div>
                        </div>

                        {match.mapPool && (
                          <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {match.mapPool}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Match Detail Dialog */}
      <Dialog open={!!selectedMatch} onOpenChange={() => setSelectedMatch(null)}>
        <DialogContent className="max-w-lg bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333]">
          {matchDetail && (
            <>
              <DialogHeader>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">{matchDetail.tournament}</p>
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <img src={matchDetail.teamA?.logoUrl} alt="" className="w-16 h-16 object-contain mx-auto" />
                      <p className="text-sm font-medium mt-1">{matchDetail.teamA?.name}</p>
                    </div>
                    <div>
                      {matchDetail.status === "upcoming" ? (
                        <span className="text-2xl font-bold text-[#1A2332] dark:text-white">VS</span>
                      ) : (
                        <div className="text-3xl font-bold text-[#1A2332] dark:text-white">
                          {matchDetail.scoreA} : {matchDetail.scoreB}
                        </div>
                      )}
                      <span className={`inline-block mt-1 px-3 py-0.5 text-[10px] font-medium rounded-full ${statusConfig[matchDetail.status]?.bg} ${statusConfig[matchDetail.status]?.text}`}>
                        {statusConfig[matchDetail.status]?.label}
                      </span>
                    </div>
                    <div className="text-center">
                      <img src={matchDetail.teamB?.logoUrl} alt="" className="w-16 h-16 object-contain mx-auto" />
                      <p className="text-sm font-medium mt-1">{matchDetail.teamB?.name}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(matchDetail.scheduledAt).toLocaleDateString()} {new Date(matchDetail.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </DialogHeader>
              {matchDetail.mapPool && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-[#252525] rounded-lg">
                  <p className="text-xs text-gray-500 uppercase mb-1">{t("mapPool", lang)}</p>
                  <p className="text-sm">{matchDetail.mapPool}</p>
                </div>
              )}
              {matchDetail.stats && matchDetail.stats.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 uppercase mb-2">{t("matchStats", lang)}</p>
                  <div className="space-y-1">
                    {matchDetail.stats.map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between text-sm py-1 border-b border-gray-100 dark:border-[#333]">
                        <span>{s.playerId}</span>
                        <span className="text-gray-500">{s.kills}/{s.deaths}/{s.assists}</span>
                        <span className="font-medium">{s.rating.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Team Quick View Dialog */}
      <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
        <DialogContent className="max-w-sm bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333]">
          {selectedTeam && (() => {
            const team = getTeam(selectedTeam);
            if (!team) return null;
            return (
              <div className="text-center py-4">
                <img src={team.logoUrl} alt={team.name} className="w-24 h-24 object-contain mx-auto" />
                <h3 className="text-xl font-bold mt-3 text-[#1A2332] dark:text-white">{team.name}</h3>
                <p className="text-sm text-gray-500">{team.region}</p>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-gray-50 dark:bg-[#252525] rounded p-2">
                    <p className="text-lg font-bold text-[#E8751A]">{team.points}</p>
                    <p className="text-[10px] text-gray-500">{t("points", lang)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#252525] rounded p-2">
                    <p className="text-lg font-bold">{team.matchesPlayed}</p>
                    <p className="text-[10px] text-gray-500">{t("matches", lang)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#252525] rounded p-2">
                    <p className="text-lg font-bold text-green-600">
                      {Math.round((team.wins / Math.max(team.matchesPlayed, 1)) * 100)}%
                    </p>
                    <p className="text-[10px] text-gray-500">{t("winRate", lang)}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
