import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";
import { trpc } from "@/providers/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Shield,
  Users,
  Swords,
  Trophy,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Newspaper,
} from "lucide-react";

type AdminTab = "dashboard" | "teams" | "players" | "matches" | "news";

export default function Admin() {
  const { lang, isAdmin } = useApp();
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem("efl_admin_token"));
  const [loginError, setLoginError] = useState("");

  const { data: dashboard } = trpc.admin.dashboard.useQuery(undefined, { enabled: !!adminToken });
  const { data: teams, refetch: refetchTeams } = trpc.teams.list.useQuery({});
  const { data: players, refetch: refetchPlayers } = trpc.players.list.useQuery({});
  const { data: matches, refetch: refetchMatches } = trpc.matches.list.useQuery({});
  const { data: newsList, refetch: refetchNews } = trpc.news.list.useQuery(undefined, { enabled: !!adminToken });

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: (data) => {
      setAdminToken(data.token);
      localStorage.setItem("efl_admin_token", data.token);
      setLoginOpen(false);
      setLoginError("");
    },
    onError: (err) => setLoginError(err.message),
  });

  useEffect(() => {
    if (!adminToken && !isAdmin) {
      setLoginOpen(true);
    }
  }, [adminToken, isAdmin]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username: adminUser, password: adminPass });
  };

  if (!adminToken && !isAdmin) {
    return (
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#1A2332] dark:text-white">
              <Shield className="w-5 h-5 text-[#E8751A]" />
              {t("adminPanel", lang)}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdminLogin} className="space-y-3 mt-2">
            {loginError && (
              <div className="flex items-center gap-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {loginError}
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Username</label>
              <Input value={adminUser} onChange={(e) => setAdminUser(e.target.value)} placeholder="admin" className="mt-1 dark:bg-[#252525]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Password</label>
              <Input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} placeholder="password" className="mt-1 dark:bg-[#252525]" />
            </div>
            <Button type="submit" className="w-full bg-[#E8751A] hover:bg-[#D46615] text-white">
              {t("login", lang)}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fadeIn">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-48 shrink-0">
          <div className="bg-[#1A2332] rounded-lg p-3 sticky top-20">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-3 px-2">{t("adminPanel", lang)}</p>
            <div className="space-y-1">
              {([
                { key: "dashboard", label: t("dashboard", lang), icon: BarChart3 },
                { key: "teams", label: t("teams", lang), icon: Shield },
                { key: "players", label: t("players", lang), icon: Users },
                { key: "matches", label: t("matches", lang), icon: Swords },
                { key: "news", label: lang === "ru" ? "Новости" : "News", icon: Newspaper },
      
              ] as { key: AdminTab; label: string; icon: any }[]).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    tab === item.key
                      ? "bg-[#E8751A] text-white"
                      : "text-gray-300 hover:bg-[#2A3A4E]"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {tab === "dashboard" && <DashboardTab dashboard={dashboard} lang={lang} />}
          {tab === "teams" && <TeamsTab teams={teams || []} lang={lang} refetch={refetchTeams} />}
          {tab === "players" && <PlayersTab players={players || []} teams={teams || []} lang={lang} refetch={refetchPlayers} />}
          {tab === "matches" && <MatchesTab matches={matches || []} teams={teams || []} lang={lang} refetch={refetchMatches} />}
          {tab === "news" && <NewsTab newsList={newsList || []} lang={lang} refetch={refetchNews} />}
        </div>
      </div>
    </div>
  );
}

function DashboardTab({ dashboard, lang }: { dashboard: any; lang: string }) {
  if (!dashboard) return null;
  const cards = [
    { label: t("totalTeams", lang), value: dashboard.totalTeams, icon: Shield, color: "text-blue-500" },
    { label: t("totalPlayers", lang), value: dashboard.totalPlayers, icon: Users, color: "text-green-500" },
    { label: t("upcomingMatches", lang), value: dashboard.upcomingMatches, icon: Trophy, color: "text-purple-500" },
    { label: t("liveMatchesCount", lang), value: dashboard.liveMatches, icon: Swords, color: "text-red-500" },
  ];
  return (
    <div>
      <h2 className="text-lg font-bold text-[#1A2332] dark:text-white mb-4">{t("dashboard", lang)}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-[#1E1E1E] rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className="text-3xl font-bold text-[#1A2332] dark:text-white mt-1">{card.value}</p>
              </div>
              <card.icon className={`w-10 h-10 ${card.color} opacity-20`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamsTab({ teams, lang, refetch }: { teams: any[]; lang: string; refetch: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTeam, setEditTeam] = useState<any>(null);
  const [form, setForm] = useState({ name: "", region: "", tier: "Tier 2" as any, coach: "", description: "" });

  const createMutation = trpc.teams.create.useMutation({ onSuccess: () => { refetch(); setModalOpen(false); } });
  const updateMutation = trpc.teams.update.useMutation({ onSuccess: () => { refetch(); setModalOpen(false); } });
  const deleteMutation = trpc.teams.delete.useMutation({ onSuccess: () => refetch() });

  const openCreate = () => { setEditTeam(null); setForm({ name: "", region: "", tier: "Tier 2", coach: "", description: "" }); setModalOpen(true); };
  const openEdit = (team: any) => { setEditTeam(team); setForm({ name: team.name, region: team.region, tier: team.tier, coach: team.coach || "", description: team.description || "" }); setModalOpen(true); };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTeam) {
      updateMutation.mutate({ id: editTeam.id, ...form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#1A2332] dark:text-white">{t("teams", lang)}</h2>
        <Button onClick={openCreate} className="bg-[#E8751A] hover:bg-[#D46615] text-white text-sm">
          <Plus className="w-4 h-4 mr-1" /> {t("addTeam", lang)}
        </Button>
      </div>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] uppercase text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-[#333]">
                <th className="px-4 py-3 text-left">Logo</th>
                <th className="px-4 py-3 text-left">{t("name", lang)}</th>
                <th className="px-4 py-3 text-left">{t("region", lang)}</th>
                <th className="px-4 py-3 text-center">{t("tier", lang)}</th>
                <th className="px-4 py-3 text-right">{t("actions", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id} className="border-b border-gray-100 dark:border-[#333] last:border-0 hover:bg-gray-50 dark:hover:bg-[#252525]">
                  <td className="px-4 py-3"><img src={team.logoUrl} alt="" className="w-8 h-8 object-contain" /></td>
                  <td className="px-4 py-3 text-sm font-medium">{team.name}</td>
                  <td className="px-4 py-3 text-sm">{team.region}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full ${team.tier === "Tier 1" ? "bg-yellow-100 text-yellow-800" : team.tier === "Tier 2" ? "bg-gray-100 text-gray-700" : "bg-amber-100 text-amber-800"}`}>
                      {team.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(team)} className="p-1 text-blue-500 hover:bg-blue-50 rounded mr-1"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteMutation.mutate({ id: team.id })} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333]">
          <DialogHeader><DialogTitle className="dark:text-white">{editTeam ? t("edit", lang) : t("addTeam", lang)}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            <div><label className="text-xs text-gray-500">{t("name", lang)}</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 dark:bg-[#252525]" /></div>
            <div><label className="text-xs text-gray-500">{t("region", lang)}</label><Input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="mt-1 dark:bg-[#252525]" /></div>
            <div>
              <label className="text-xs text-gray-500">{t("tier", lang)}</label>
              <Select value={form.tier} onValueChange={(v: any) => setForm({ ...form, tier: v })}>
                <SelectTrigger className="mt-1 dark:bg-[#252525]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tier 1">Tier 1</SelectItem>
                  <SelectItem value="Tier 2">Tier 2</SelectItem>
                  <SelectItem value="Tier 3">Tier 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><label className="text-xs text-gray-500">{t("coach", lang)}</label><Input value={form.coach} onChange={(e) => setForm({ ...form, coach: e.target.value })} className="mt-1 dark:bg-[#252525]" /></div>
            <Button type="submit" className="w-full bg-[#E8751A] hover:bg-[#D46615] text-white">{t("save", lang)}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PlayersTab({ players, teams, lang, refetch }: { players: any[]; teams: any[]; lang: string; refetch: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlayer, setEditPlayer] = useState<any>(null);
  const [form, setForm] = useState({ name: "", nickname: "", nationality: "", role: "Entry" as any, teamId: null as number | null, tier: "Tier 2" as any, rating: 1.0 });

  const createMutation = trpc.players.create.useMutation({ onSuccess: () => { refetch(); setModalOpen(false); } });
  const updateMutation = trpc.players.update.useMutation({ onSuccess: () => { refetch(); setModalOpen(false); } });
  const deleteMutation = trpc.players.delete.useMutation({ onSuccess: () => refetch() });

  const openCreate = () => { setEditPlayer(null); setForm({ name: "", nickname: "", nationality: "", role: "Entry", teamId: null, tier: "Tier 2", rating: 1.0 }); setModalOpen(true); };
  const openEdit = (p: any) => { setEditPlayer(p); setForm({ name: p.name, nickname: p.nickname, nationality: p.nationality, role: p.role, teamId: p.teamId, tier: p.tier, rating: p.rating }); setModalOpen(true); };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); editPlayer ? updateMutation.mutate({ id: editPlayer.id, ...form }) : createMutation.mutate(form); };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#1A2332] dark:text-white">{t("players", lang)}</h2>
        <Button onClick={openCreate} className="bg-[#E8751A] hover:bg-[#D46615] text-white text-sm"><Plus className="w-4 h-4 mr-1" /> {t("addPlayer", lang)}</Button>
      </div>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] uppercase text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-[#333]">
                <th className="px-4 py-3 text-left">Avatar</th>
                <th className="px-4 py-3 text-left">{t("nickname", lang)}</th>
                <th className="px-4 py-3 text-left">{t("team", lang)}</th>
                <th className="px-4 py-3 text-center">{t("role", lang)}</th>
                <th className="px-4 py-3 text-center">{t("tier", lang)}</th>
                <th className="px-4 py-3 text-right">{t("actions", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => {
                const team = teams.find((t) => t.id === p.teamId);
                return (
                  <tr key={p.id} className="border-b border-gray-100 dark:border-[#333] last:border-0 hover:bg-gray-50 dark:hover:bg-[#252525]">
                    <td className="px-4 py-3"><img src={p.avatarUrl || "/player-1.png"} alt="" className="w-8 h-8 rounded-full object-cover" /></td>
                    <td className="px-4 py-3 text-sm font-medium">{p.nickname}</td>
                    <td className="px-4 py-3 text-sm">{team?.name || "-"}</td>
                    <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 text-[10px] rounded-full bg-gray-100">{p.role}</span></td>
                    <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 text-[10px] rounded-full ${p.tier === "Tier 1" ? "bg-yellow-100 text-yellow-800" : p.tier === "Tier 2" ? "bg-gray-100 text-gray-700" : "bg-amber-100 text-amber-800"}`}>{p.tier}</span></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(p)} className="p-1 text-blue-500 hover:bg-blue-50 rounded mr-1"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => deleteMutation.mutate({ id: p.id })} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333]">
          <DialogHeader><DialogTitle className="dark:text-white">{editPlayer ? t("edit", lang) : t("addPlayer", lang)}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            <div><label className="text-xs text-gray-500">{t("name", lang)}</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 dark:bg-[#252525]" /></div>
            <div><label className="text-xs text-gray-500">{t("nickname", lang)}</label><Input value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} className="mt-1 dark:bg-[#252525]" /></div>
            <div><label className="text-xs text-gray-500">{t("nationality", lang)}</label><Input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} className="mt-1 dark:bg-[#252525]" /></div>
            <div>
              <label className="text-xs text-gray-500">{t("role", lang)}</label>
              <Select value={form.role} onValueChange={(v: any) => setForm({ ...form, role: v })}>
                <SelectTrigger className="mt-1 dark:bg-[#252525]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["AWPer", "Entry", "IGL", "Lurk", "Support"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-gray-500">{t("team", lang)}</label>
              <Select value={form.teamId?.toString() || "none"} onValueChange={(v) => setForm({ ...form, teamId: v === "none" ? null : parseInt(v) })}>
                <SelectTrigger className="mt-1 dark:bg-[#252525]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {teams.map((t) => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-gray-500">{t("tier", lang)}</label>
              <Select value={form.tier} onValueChange={(v: any) => setForm({ ...form, tier: v })}>
                <SelectTrigger className="mt-1 dark:bg-[#252525]"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Tier 1">Tier 1</SelectItem><SelectItem value="Tier 2">Tier 2</SelectItem><SelectItem value="Tier 3">Tier 3</SelectItem></SelectContent>
              </Select>
            </div>
            <div><label className="text-xs text-gray-500">{t("rating", lang)}</label><Input type="number" step="0.01" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })} className="mt-1 dark:bg-[#252525]" /></div>
            <Button type="submit" className="w-full bg-[#E8751A] hover:bg-[#D46615] text-white">{t("save", lang)}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MatchesTab({ matches, teams, lang, refetch }: { matches: any[]; teams: any[]; lang: string; refetch: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editMatch, setEditMatch] = useState<any>(null);
  const [form, setForm] = useState({ teamAId: 1, teamBId: 2, tournament: "", scheduledAt: "", status: "upcoming" as any, scoreA: 0, scoreB: 0, mapPool: "" });

  const createMutation = trpc.matches.create.useMutation({ onSuccess: () => { refetch(); setModalOpen(false); } });
  const updateMutation = trpc.matches.update.useMutation({ onSuccess: () => { refetch(); setModalOpen(false); } });
  const deleteMutation = trpc.matches.delete.useMutation({ onSuccess: () => refetch() });

  const openCreate = () => { setEditMatch(null); setForm({ teamAId: teams[0]?.id || 1, teamBId: teams[1]?.id || 2, tournament: "", scheduledAt: new Date().toISOString().slice(0, 16), status: "upcoming", scoreA: 0, scoreB: 0, mapPool: "" }); setModalOpen(true); };
  const openEdit = (m: any) => { setEditMatch(m); setForm({ teamAId: m.teamAId, teamBId: m.teamBId, tournament: m.tournament, scheduledAt: m.scheduledAt.slice(0, 16), status: m.status, scoreA: m.scoreA, scoreB: m.scoreB, mapPool: m.mapPool || "" }); setModalOpen(true); };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); editMatch ? updateMutation.mutate({ id: editMatch.id, ...form }) : createMutation.mutate(form); };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#1A2332] dark:text-white">{t("matches", lang)}</h2>
        <Button onClick={openCreate} className="bg-[#E8751A] hover:bg-[#D46615] text-white text-sm"><Plus className="w-4 h-4 mr-1" /> {t("addMatch", lang)}</Button>
      </div>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] uppercase text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-[#333]">
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">{t("team", lang)} A</th>
                <th className="px-4 py-3 text-left">{t("team", lang)} B</th>
                <th className="px-4 py-3 text-center">{t("score", lang)}</th>
                <th className="px-4 py-3 text-center">{t("status", lang)}</th>
                <th className="px-4 py-3 text-right">{t("actions", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m) => {
                const teamA = teams.find((t) => t.id === m.teamAId);
                const teamB = teams.find((t) => t.id === m.teamBId);
                return (
                  <tr key={m.id} className="border-b border-gray-100 dark:border-[#333] last:border-0 hover:bg-gray-50 dark:hover:bg-[#252525]">
                    <td className="px-4 py-3 text-sm">{new Date(m.scheduledAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm">{teamA?.name || "?"}</td>
                    <td className="px-4 py-3 text-sm">{teamB?.name || "?"}</td>
                    <td className="px-4 py-3 text-center text-sm font-medium">{m.status !== "upcoming" ? `${m.scoreA} : ${m.scoreB}` : "-"}</td>
                    <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 text-[10px] rounded-full text-white ${m.status === "live" ? "bg-red-500" : m.status === "finished" ? "bg-gray-500" : "bg-[#1A2332]"}`}>{m.status}</span></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(m)} className="p-1 text-blue-500 hover:bg-blue-50 rounded mr-1"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => deleteMutation.mutate({ id: m.id })} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333]">
          <DialogHeader><DialogTitle className="dark:text-white">{editMatch ? t("edit", lang) : t("addMatch", lang)}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            <div>
              <label className="text-xs text-gray-500">Team A</label>
              <Select value={form.teamAId.toString()} onValueChange={(v) => setForm({ ...form, teamAId: parseInt(v) })}>
                <SelectTrigger className="mt-1 dark:bg-[#252525]"><SelectValue /></SelectTrigger>
                <SelectContent>{teams.map((t) => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-gray-500">Team B</label>
              <Select value={form.teamBId.toString()} onValueChange={(v) => setForm({ ...form, teamBId: parseInt(v) })}>
                <SelectTrigger className="mt-1 dark:bg-[#252525]"><SelectValue /></SelectTrigger>
                <SelectContent>{teams.map((t) => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs text-gray-500">{t("tournament", lang)}</label><Input value={form.tournament} onChange={(e) => setForm({ ...form, tournament: e.target.value })} className="mt-1 dark:bg-[#252525]" /></div>
            <div><label className="text-xs text-gray-500">{t("scheduledAt", lang)}</label><Input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} className="mt-1 dark:bg-[#252525]" /></div>
            <div>
              <label className="text-xs text-gray-500">{t("status", lang)}</label>
              <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                <SelectTrigger className="mt-1 dark:bg-[#252525]"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="upcoming">Upcoming</SelectItem><SelectItem value="live">Live</SelectItem><SelectItem value="finished">Finished</SelectItem></SelectContent>
              </Select>
            </div>
            {form.status !== "upcoming" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500">Score A</label><Input type="number" value={form.scoreA} onChange={(e) => setForm({ ...form, scoreA: parseInt(e.target.value) })} className="mt-1 dark:bg-[#252525]" /></div>
                  <div><label className="text-xs text-gray-500">Score B</label><Input type="number" value={form.scoreB} onChange={(e) => setForm({ ...form, scoreB: parseInt(e.target.value) })} className="mt-1 dark:bg-[#252525]" /></div>
                </div>
              </>
            )}
            <div><label className="text-xs text-gray-500">{t("mapPool", lang)}</label><Input value={form.mapPool} onChange={(e) => setForm({ ...form, mapPool: e.target.value })} className="mt-1 dark:bg-[#252525]" /></div>
            <Button type="submit" className="w-full bg-[#E8751A] hover:bg-[#D46615] text-white">{t("save", lang)}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function NewsTab({ newsList, lang, refetch }: { newsList: any[]; lang: string; refetch: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", imageUrl: "" });

  const createMutation = trpc.news.create.useMutation({
    onSuccess: () => {
      refetch();
      setModalOpen(false);
      setForm({ title: "", content: "", imageUrl: "" });
    }
  });

  const deleteMutation = trpc.news.delete.useMutation({ onSuccess: () => refetchNews() });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#1A2332] dark:text-white">{lang === "ru" ? "Управление новостями" : "Manage News"}</h2>
        <Button onClick={() => setModalOpen(true)} className="bg-[#E8751A] hover:bg-[#D46615] text-white flex items-center gap-1 text-xs px-3 py-1.5">
          <Plus className="w-4 h-4" /> {lang === "ru" ? "Добавить новость" : "Add News"}
        </Button>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-[#252525] text-gray-600 dark:text-gray-400 text-xs font-medium uppercase border-b border-gray-100 dark:border-[#333]">
            <tr>
              <th className="px-4 py-3">{lang === "ru" ? "Заголовок" : "Title"}</th>
              <th className="px-4 py-3">{lang === "ru" ? "Текст" : "Content"}</th>
              <th className="px-4 py-3 text-right">{lang === "ru" ? "Действия" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[#333] text-gray-700 dark:text-gray-300">
            {newsList.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-[#252525]/30">
                <td className="px-4 py-3 font-medium">{item.title}</td>
                <td className="px-4 py-3 max-w-xs truncate">{item.content}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => deleteMutation.mutate({ id: item.id })} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333] text-[#1A2332] dark:text-white">
          <DialogHeader>
            <DialogTitle>{lang === "ru" ? "Новая новость" : "New News Article"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{lang === "ru" ? "Заголовок" : "Title"}</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-1 dark:bg-[#252525]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{lang === "ru" ? "Текст новости" : "Content"}</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={4} className="w-full mt-1 p-2 border rounded-md text-sm bg-white dark:bg-[#252525] border-gray-200 dark:border-[#333] focus:outline-none focus:ring-1 focus:ring-[#E8751A]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{lang === "ru" ? "Ссылка на картинку" : "Image URL"}</label>
              <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="/news-1.png" className="mt-1 dark:bg-[#252525]" />
            </div>
            <Button type="submit" className="w-full bg-[#E8751A] hover:bg-[#D46615] text-white">
              {lang === "ru" ? "Опубликовать" : "Publish"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
