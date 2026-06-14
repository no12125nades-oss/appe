import { Link } from "react-router";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";
import { trpc } from "@/providers/trpc";
import { motion } from "framer-motion";
import { ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface HomeProps {
  onLoginClick: () => void;
}

export default function Home({ onLoginClick: _onLoginClick }: HomeProps) {
  const { data: dynamicNews } = trpc.news.list.useQuery();
  const { lang } = useApp();
  const { data: teams } = trpc.teams.list.useQuery({});
  const { data: players } = trpc.players.list.useQuery({});
  const { data: matches } = trpc.matches.list.useQuery({});

  const sortedTeams = [...(teams || [])].sort((a, b) => b.points - a.points).slice(0, 5);
  const sortedPlayers = [...(players || [])].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const featuredMatches = matches?.slice(0, 3) || [];

  const getTeamById = (id: number) => teams?.find((t) => t.id === id);

  return (
    <div className="animate-fadeIn">
      {/* Hero */}
      <section className="relative h-[380px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/hero-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A2332]/80 to-[#0D1520]/90" />
        <div className="relative z-10 text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="text-[#E8751A] text-xs font-medium tracking-[3px] uppercase mb-3"
          >
            EFL — {t("eflSubtitle", lang)}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            {t("heroTitle", lang)}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto mb-6"
          >
            {t("heroSubtitle", lang)}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3"
          >
            <Link
              to="/rankings"
              className="px-5 py-2.5 bg-[#E8751A] text-white text-sm font-medium rounded-md hover:bg-[#D46615] transition-colors"
            >
              {t("viewRankings", lang)}
            </Link>
            <Link
              to="/matches"
              className="px-5 py-2.5 border border-white/30 text-white text-sm font-medium rounded-md hover:bg-white/10 transition-colors"
            >
              {t("liveMatches", lang)}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Matches */}
      {featuredMatches.length > 0 && (
        <section className="bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-[#333]">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredMatches.map((match) => {
                const teamA = getTeamById(match.teamAId);
                const teamB = getTeamById(match.teamBId);
                if (!teamA || !teamB) return null;
                return (
                  <Link
                    key={match.id}
                    to="/matches"
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-[#252525] rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={teamA.logoUrl} alt={teamA.name} className="w-10 h-10 object-contain" />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{teamA.name}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-gray-400">VS</span>
                      <div className="text-lg font-bold text-[#1A2332] dark:text-white">
                        {match.status === "upcoming"
                          ? new Date(match.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : `${match.scoreA} : ${match.scoreB}`}
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full text-white font-medium ${
                          match.status === "live"
                            ? "bg-red-500 animate-pulse"
                            : match.status === "finished"
                            ? "bg-gray-500"
                            : "bg-[#1A2332]"
                        }`}
                      >
                        {match.status === "live" ? "LIVE" : match.status === "finished" ? t("finished", lang) : t("upcoming", lang)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{teamB.name}</span>
                      <img src={teamB.logoUrl} alt={teamB.name} className="w-10 h-10 object-contain" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 bg-[#E8751A] rounded" />
          <h2 className="text-lg font-bold text-[#1A2332] dark:text-white">{t("latestNews", lang)}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          (dynamicNews || []).map((news, i) => (

            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={news.img}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="inline-block px-2 py-0.5 bg-[#E8751A] text-white text-[10px] font-medium rounded mb-2">
                  {news.cat}
                </span>
                <h3 className="text-sm font-semibold text-[#1A2332] dark:text-white line-clamp-2 mb-1">
                  {news.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{news.desc}</p>
                <span className="text-[11px] text-gray-400 mt-2 block">{news.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Rankings Preview */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Teams */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#1A2332] dark:text-white">{t("topTeams", lang)}</h3>
              <Link to="/rankings" className="text-xs text-[#E8751A] hover:underline flex items-center gap-0.5">
                {t("viewAll", lang)} <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-0">
              {sortedTeams.map((team, i) => (
                <div
                  key={team.id}
                  className="flex items-center gap-3 py-2.5 border-b border-gray-100 dark:border-[#333] last:border-0 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/rankings?team=${team.id}`}
                >
                  <span
                    className={`w-6 text-center font-bold text-sm ${
                      i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <img src={team.logoUrl} alt={team.name} className="w-7 h-7 object-contain" />
                  <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">{team.name}</span>
                  <span className="text-sm text-gray-500">{team.points} pts</span>
                  {team.trend > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                  ) : team.trend < 0 ? (
                    <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                  ) : (
                    <Minus className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top Players */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#1A2332] dark:text-white">{t("topPlayers", lang)}</h3>
              <Link to="/rankings?tab=players" className="text-xs text-[#E8751A] hover:underline flex items-center gap-0.5">
                {t("viewAll", lang)} <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-0">
              {sortedPlayers.map((player, i) => {
                const team = getTeamById(player.teamId || 0);
                return (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 py-2.5 border-b border-gray-100 dark:border-[#333] last:border-0 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors cursor-pointer"
                  >
                    <span
                      className={`w-6 text-center font-bold text-sm ${
                        i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <img
                      src={player.avatarUrl || "/player-1.png"}
                      alt={player.nickname}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">{player.nickname}</span>
                    {team && <span className="text-[11px] text-gray-500">{team.name}</span>}
                    <span className="text-sm font-semibold text-[#E8751A]">{player.rating.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
