import type { Team, Player, Match, SiteUser, MatchStat } from "../db/schema";
import { news as newsTable } from "../db/schema";

// Seed data for teams
let teams: Team[] = [
  { id: 1, name: "Alpha Wolves", region: "Europe", tier: "Tier 1", logoUrl: "/team-logo-1.png", matchesPlayed: 42, wins: 35, losses: 7, points: 1245, worldRank: 1, coach: "Alex " + "" + "Kovacs", description: "Top European CS2 team", trend: 1 },
  { id: 2, name: "Eagle Esports", region: "North America", tier: "Tier 1", logoUrl: "/team-logo-2.png", matchesPlayed: 38, wins: 30, losses: 8, points: 1201, worldRank: 2, coach: "John " + "" + "Smith", description: "NA powerhouse", trend: 0 },
  { id: 3, name: "Dragon Gaming", region: "Europe", tier: "Tier 1", logoUrl: "/team-logo-3.png", matchesPlayed: 40, wins: 28, losses: 12, points: 1180, worldRank: 3, coach: "Mikael " + "" + "Larsson", description: "Swedish elite squad", trend: -2 },
  { id: 4, name: "Bear Clan", region: "CIS", tier: "Tier 2", logoUrl: "/team-logo-4.png", matchesPlayed: 35, wins: 22, losses: 13, points: 1070, worldRank: 8, coach: "Dmitry " + "" + "Ivanov", description: "Rising CIS team", trend: -1 },
  { id: 5, name: "Lion Pride", region: "South America", tier: "Tier 2", logoUrl: "/team-logo-5.png", matchesPlayed: 32, wins: 20, losses: 12, points: 1050, worldRank: 10, coach: "Carlos " + "" + "Silva", description: "Brazilian force", trend: 2 },
  { id: 6, name: "Cobra Strike", region: "Asia", tier: "Tier 3", logoUrl: "/team-logo-6.png", matchesPlayed: 28, wins: 16, losses: 12, points: 920, worldRank: 15, coach: "Wei " + "" + "Chen", description: "Asian contender", trend: 3 },
  { id: 7, name: "Falcon Eye", region: "Europe", tier: "Tier 2", logoUrl: "/team-logo-7.png", matchesPlayed: 30, wins: 18, losses: 12, points: 1010, worldRank: 12, coach: "Pierre " + "" + "Dubois", description: "French squad", trend: 0 },
  { id: 8, name: "Tiger Fury", region: "Asia", tier: "Tier 1", logoUrl: "/team-logo-8.png", matchesPlayed: 36, wins: 25, losses: 11, points: 1120, worldRank: 5, coach: "Jin " + "" + "Park", description: "Korean elite", trend: -1 },
  { id: 9, name: "Phoenix Rise", region: "North America", tier: "Tier 3", logoUrl: "/team-logo-1.png", matchesPlayed: 25, wins: 14, losses: 11, points: 880, worldRank: 18, coach: "Mike " + "" + "Johnson", description: "NA hopeful", trend: 1 },
  { id: 10, name: "Shark Squad", region: "Europe", tier: "Tier 2", logoUrl: "/team-logo-3.png", matchesPlayed: 33, wins: 19, losses: 14, points: 980, worldRank: 14, coach: "Lars " + "" + "Andersen", description: "Danish sharks", trend: -2 },
  { id: 11, name: "Viper Venom", region: "CIS", tier: "Tier 3", logoUrl: "/team-logo-6.png", matchesPlayed: 22, wins: 12, losses: 10, points: 850, worldRank: 22, coach: "Sergey " + "" + "Petrov", description: "Ukrainian squad", trend: 0 },
  { id: 12, name: "Raptor Claw", region: "South America", tier: "Tier 3", logoUrl: "/team-logo-2.png", matchesPlayed: 20, wins: 11, losses: 9, points: 820, worldRank: 25, coach: "Luis " + "" + "Garcia", description: "Argentinian team", trend: 2 },
];

// Seed data for players
let players: Player[] = [
  { id: 1, name: "Alexander Petrov", nickname: "S1mpleX", nationality: "Ukraine", role: "AWPer", teamId: 1, tier: "Tier 1", avatarUrl: "/player-1.png", rating: 1.35, kdRatio: 1.42, adr: 92.5, kast: 78.2, mapsPlayed: 38, mvpCount: 12 },
  { id: 2, name: "Marcus Johnson", nickname: "Fury", nationality: "USA", role: "Entry", teamId: 1, tier: "Tier 1", avatarUrl: "/player-2.png", rating: 1.18, kdRatio: 1.15, adr: 85.3, kast: 74.1, mapsPlayed: 40, mvpCount: 5 },
  { id: 3, name: "Erik Lindqvist", nickname: "Iceman", nationality: "Sweden", role: "IGL", teamId: 1, tier: "Tier 1", avatarUrl: "/player-3.png", rating: 1.08, kdRatio: 0.98, adr: 78.1, kast: 82.5, mapsPlayed: 42, mvpCount: 3 },
  { id: 4, name: "Wei Zhang", nickname: "Shadow", nationality: "China", role: "Lurk", teamId: 1, tier: "Tier 1", avatarUrl: "/player-4.png", rating: 1.22, kdRatio: 1.25, adr: 88.7, kast: 71.3, mapsPlayed: 36, mvpCount: 8 },
  { id: 5, name: "Lucas Martinez", nickname: "Supporto", nationality: "Spain", role: "Support", teamId: 1, tier: "Tier 1", avatarUrl: "/player-5.png", rating: 1.05, kdRatio: 0.92, adr: 72.4, kast: 85.1, mapsPlayed: 42, mvpCount: 2 },
  { id: 6, name: "Jake Williams", nickname: "EagleEye", nationality: "Canada", role: "AWPer", teamId: 2, tier: "Tier 1", avatarUrl: "/player-1.png", rating: 1.28, kdRatio: 1.32, adr: 89.1, kast: 76.4, mapsPlayed: 35, mvpCount: 9 },
  { id: 7, name: "Tom Bradley", nickname: "Rush", nationality: "USA", role: "Entry", teamId: 2, tier: "Tier 1", avatarUrl: "/player-2.png", rating: 1.15, kdRatio: 1.08, adr: 86.2, kast: 70.8, mapsPlayed: 38, mvpCount: 4 },
  { id: 8, name: "Mikael Larsson", nickname: "Tactix", nationality: "Sweden", role: "IGL", teamId: 3, tier: "Tier 1", avatarUrl: "/player-3.png", rating: 1.12, kdRatio: 1.05, adr: 80.3, kast: 79.6, mapsPlayed: 40, mvpCount: 6 },
  { id: 9, name: "Anna Kowalski", nickname: "Panther", nationality: "Poland", role: "Lurk", teamId: 3, tier: "Tier 1", avatarUrl: "/player-4.png", rating: 1.20, kdRatio: 1.18, adr: 84.5, kast: 73.2, mapsPlayed: 37, mvpCount: 7 },
  { id: 10, name: "Dmitry Sokolov", nickname: "Bear", nationality: "Russia", role: "Entry", teamId: 4, tier: "Tier 2", avatarUrl: "/player-5.png", rating: 1.14, kdRatio: 1.12, adr: 83.1, kast: 72.5, mapsPlayed: 33, mvpCount: 4 },
  { id: 11, name: "Carlos Mendez", nickname: "LionHeart", nationality: "Brazil", role: "IGL", teamId: 5, tier: "Tier 2", avatarUrl: "/player-1.png", rating: 1.09, kdRatio: 0.95, adr: 76.8, kast: 81.3, mapsPlayed: 30, mvpCount: 3 },
  { id: 12, name: "Wei Chen", nickname: "Cobra", nationality: "China", role: "AWPer", teamId: 6, tier: "Tier 3", avatarUrl: "/player-2.png", rating: 1.16, kdRatio: 1.14, adr: 81.2, kast: 69.7, mapsPlayed: 26, mvpCount: 5 },
  { id: 13, name: "Pierre Martin", nickname: "Falcon", nationality: "France", role: "Support", teamId: 7, tier: "Tier 2", avatarUrl: "/player-3.png", rating: 1.06, kdRatio: 0.94, adr: 73.5, kast: 84.2, mapsPlayed: 28, mvpCount: 1 },
  { id: 14, name: "Jin Park", nickname: "Tiger", nationality: "South Korea", role: "Entry", teamId: 8, tier: "Tier 1", avatarUrl: "/player-4.png", rating: 1.24, kdRatio: 1.22, adr: 90.3, kast: 75.1, mapsPlayed: 34, mvpCount: 8 },
  { id: 15, name: "Sven Johansson", nickname: "Viking", nationality: "Denmark", role: "Lurk", teamId: 10, tier: "Tier 2", avatarUrl: "/player-5.png", rating: 1.10, kdRatio: 1.02, adr: 79.4, kast: 74.8, mapsPlayed: 31, mvpCount: 3 },
  { id: 16, name: "Ivan Petrenko", nickname: "Viper", nationality: "Ukraine", role: "AWPer", teamId: 11, tier: "Tier 3", avatarUrl: "/player-1.png", rating: 1.08, kdRatio: 1.05, adr: 77.2, kast: 68.5, mapsPlayed: 20, mvpCount: 3 },
  { id: 17, name: "Luis Garcia", nickname: "Raptor", nationality: "Argentina", role: "IGL", teamId: 12, tier: "Tier 3", avatarUrl: "/player-2.png", rating: 1.02, kdRatio: 0.88, adr: 71.3, kast: 80.1, mapsPlayed: 18, mvpCount: 1 },
  { id: 18, name: "Nikolay Volkov", nickname: "Ghost", nationality: "Russia", role: "Support", teamId: 4, tier: "Tier 2", avatarUrl: "/player-3.png", rating: 1.03, kdRatio: 0.91, adr: 74.6, kast: 83.7, mapsPlayed: 32, mvpCount: 2 },
  { id: 19, name: "Felipe Santos", nickname: "Flash", nationality: "Brazil", role: "Entry", teamId: 5, tier: "Tier 2", avatarUrl: "/player-4.png", rating: 1.11, kdRatio: 1.08, adr: 82.1, kast: 71.4, mapsPlayed: 29, mvpCount: 4 },
  { id: 20, name: "Min-jae Kim", nickname: "Ninja", nationality: "South Korea", role: "Lurk", teamId: 8, tier: "Tier 1", avatarUrl: "/player-5.png", rating: 1.19, kdRatio: 1.16, adr: 86.4, kast: 72.9, mapsPlayed: 33, mvpCount: 6 },
  { id: 21, name: "Andrei Popov", nickname: "Sniper", nationality: "Russia", role: "AWPer", teamId: 2, tier: "Tier 1", avatarUrl: "/player-1.png", rating: 1.21, kdRatio: 1.24, adr: 85.7, kast: 74.3, mapsPlayed: 36, mvpCount: 7 },
  { id: 22, name: "David Kim", nickname: "Phoenix", nationality: "USA", role: "Support", teamId: 9, tier: "Tier 3", avatarUrl: "/player-2.png", rating: 1.01, kdRatio: 0.89, adr: 70.8, kast: 79.5, mapsPlayed: 22, mvpCount: 1 },
  { id: 23, name: "Hans Mueller", nickname: "Tank", nationality: "Germany", role: "Entry", teamId: 7, tier: "Tier 2", avatarUrl: "/player-3.png", rating: 1.07, kdRatio: 0.96, adr: 78.9, kast: 76.2, mapsPlayed: 27, mvpCount: 2 },
  { id: 24, name: "Yuki Tanaka", nickname: "Blade", nationality: "Japan", role: "Lurk", teamId: 6, tier: "Tier 3", avatarUrl: "/player-4.png", rating: 1.04, kdRatio: 0.98, adr: 75.3, kast: 73.1, mapsPlayed: 24, mvpCount: 2 },
  { id: 25, name: "Oleg Kuznetsov", nickname: "Hammer", nationality: "Belarus", role: "IGL", teamId: 11, tier: "Tier 3", avatarUrl: "/player-5.png", rating: 0.98, kdRatio: 0.85, adr: 69.2, kast: 82.4, mapsPlayed: 19, mvpCount: 0 },
];

// Seed data for matches
const now = new Date();
const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(now); twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

let matches: Match[] = [
  { id: 1, teamAId: 1, teamBId: 2, tournament: "EFL Major 2025", scheduledAt: twoDaysAgo.toISOString(), status: "finished", scoreA: 16, scoreB: 12, mapPool: "Dust2, Mirage, Inferno", mvpPlayerId: 1 },
  { id: 2, teamAId: 3, teamBId: 8, tournament: "EFL Major 2025", scheduledAt: twoDaysAgo.toISOString(), status: "finished", scoreA: 14, scoreB: 16, mapPool: "Nuke, Overpass", mvpPlayerId: 14 },
  { id: 3, teamAId: 4, teamBId: 7, tournament: "EFL Weekly", scheduledAt: yesterday.toISOString(), status: "finished", scoreA: 16, scoreB: 9, mapPool: "Mirage", mvpPlayerId: 10 },
  { id: 4, teamAId: 5, teamBId: 10, tournament: "EFL Weekly", scheduledAt: yesterday.toISOString(), status: "finished", scoreA: 12, scoreB: 16, mapPool: "Inferno, Vertigo", mvpPlayerId: 15 },
  { id: 5, teamAId: 6, teamBId: 11, tournament: "EFL Challenger", scheduledAt: yesterday.toISOString(), status: "finished", scoreA: 16, scoreB: 11, mapPool: "Anubis", mvpPlayerId: 12 },
  { id: 6, teamAId: 1, teamBId: 3, tournament: "EFL Major 2025", scheduledAt: now.toISOString(), status: "live", scoreA: 9, scoreB: 6, mapPool: "Dust2", mvpPlayerId: null },
  { id: 7, teamAId: 8, teamBId: 2, tournament: "EFL Major 2025", scheduledAt: now.toISOString(), status: "live", scoreA: 12, scoreB: 12, mapPool: "Mirage", mvpPlayerId: null },
  { id: 8, teamAId: 4, teamBId: 5, tournament: "EFL Weekly", scheduledAt: now.toISOString(), status: "live", scoreA: 5, scoreB: 8, mapPool: "Nuke", mvpPlayerId: null },
  { id: 9, teamAId: 1, teamBId: 8, tournament: "EFL Major Finals", scheduledAt: tomorrow.toISOString(), status: "upcoming", scoreA: 0, scoreB: 0, mapPool: "TBD", mvpPlayerId: null },
  { id: 10, teamAId: 2, teamBId: 3, tournament: "EFL Major Finals", scheduledAt: tomorrow.toISOString(), status: "upcoming", scoreA: 0, scoreB: 0, mapPool: "TBD", mvpPlayerId: null },
  { id: 11, teamAId: 6, teamBId: 7, tournament: "EFL Challenger", scheduledAt: tomorrow.toISOString(), status: "upcoming", scoreA: 0, scoreB: 0, mapPool: "Anubis, Vertigo", mvpPlayerId: null },
  { id: 12, teamAId: 10, teamBId: 9, tournament: "EFL Weekly", scheduledAt: tomorrow.toISOString(), status: "upcoming", scoreA: 0, scoreB: 0, mapPool: "Inferno", mvpPlayerId: null },
  { id: 13, teamAId: 11, teamBId: 12, tournament: "EFL Challenger", scheduledAt: tomorrow.toISOString(), status: "upcoming", scoreA: 0, scoreB: 0, mapPool: "Mirage, Overpass", mvpPlayerId: null },
  { id: 14, teamAId: 5, teamBId: 7, tournament: "EFL Weekly", scheduledAt: new Date(tomorrow.getTime() + 86400000).toISOString(), status: "upcoming", scoreA: 0, scoreB: 0, mapPool: "Dust2", mvpPlayerId: null },
  { id: 15, teamAId: 1, teamBId: 4, tournament: "EFL Showmatch", scheduledAt: new Date(tomorrow.getTime() + 86400000).toISOString(), status: "upcoming", scoreA: 0, scoreB: 0, mapPool: "Nuke, Mirage, Inferno", mvpPlayerId: null },
];

let matchStats: MatchStat[] = [
  { id: 1, matchId: 1, playerId: 1, teamId: 1, kills: 28, deaths: 14, assists: 5, adr: 98.5, rating: 1.72 },
  { id: 2, matchId: 1, playerId: 2, teamId: 1, kills: 22, deaths: 16, assists: 8, adr: 88.3, rating: 1.35 },
  { id: 3, matchId: 1, playerId: 6, teamId: 2, kills: 18, deaths: 20, assists: 6, adr: 76.2, rating: 0.92 },
  { id: 4, matchId: 1, playerId: 7, teamId: 2, kills: 20, deaths: 22, assists: 4, adr: 82.1, rating: 0.98 },
];

// Site users (in-memory, separate from OAuth users)
let siteUsers: SiteUser[] = [
  { id: 1, username: "admin", email: "admin@efl.gg", password: "adminknjazx", role: "admin", teamId: null, rating: 0, matchesPlayed: 0, wins: 0, createdAt: new Date().toISOString() },
];

let nextId = {
  team: 13,
  player: 26,
  match: 16,
  matchStat: 5,
  siteUser: 2,
};

// Helper functions for data access
export const store = {
  // Teams
  getTeams: (tier?: string) => tier ? teams.filter(t => t.tier === tier) : [...teams],
  getTeamById: (id: number) => teams.find(t => t.id === id),
  createTeam: (data: Omit<Team, "id">) => {
    const team = { ...data, id: nextId.team++ };
    teams.push(team);
    return team;
  },
  updateTeam: (id: number, data: Partial<Team>) => {
    const idx = teams.findIndex(t => t.id === id);
    if (idx === -1) return null;
    teams[idx] = { ...teams[idx], ...data };
    return teams[idx];
  },
  deleteTeam: (id: number) => {
    const idx = teams.findIndex(t => t.id === id);
    if (idx === -1) return false;
    teams.splice(idx, 1);
    // Unassign players
    players.forEach(p => { if (p.teamId === id) p.teamId = null; });
    return true;
  },

  // Players
  getPlayers: (tier?: string, role?: string) => {
    let result = [...players];
    if (tier) result = result.filter(p => p.tier === tier);
    if (role) result = result.filter(p => p.role === role);
    return result;
  },
  getPlayerById: (id: number) => players.find(p => p.id === id),
  createPlayer: (data: Omit<Player, "id">) => {
    const player = { ...data, id: nextId.player++ };
    players.push(player);
    return player;
  },
  updatePlayer: (id: number, data: Partial<Player>) => {
    const idx = players.findIndex(p => p.id === id);
    if (idx === -1) return null;
    players[idx] = { ...players[idx], ...data };
    return players[idx];
  },
  deletePlayer: (id: number) => {
    const idx = players.findIndex(p => p.id === id);
    if (idx === -1) return false;
    players.splice(idx, 1);
    return true;
  },

  // Matches
  getMatches: (status?: string) => status ? matches.filter(m => m.status === status) : [...matches],
  getMatchById: (id: number) => matches.find(m => m.id === id),
  createMatch: (data: Omit<Match, "id">) => {
    const match = { ...data, id: nextId.match++ };
    matches.push(match);
    return match;
  },
  updateMatch: (id: number, data: Partial<Match>) => {
    const idx = matches.findIndex(m => m.id === id);
    if (idx === -1) return null;
    matches[idx] = { ...matches[idx], ...data };
    return matches[idx];
  },
  deleteMatch: (id: number) => {
    const idx = matches.findIndex(m => m.id === id);
    if (idx === -1) return false;
    matches.splice(idx, 1);
    return true;
  },

  // Match Stats
  getMatchStats: (matchId: number) => matchStats.filter(ms => ms.matchId === matchId),
  createMatchStat: (data: Omit<MatchStat, "id">) => {
    const stat = { ...data, id: nextId.matchStat++ };
    matchStats.push(stat);
    return stat;
  },

  // Site Users
  getSiteUserByUsername: (username: string) => siteUsers.find(u => u.username === username),
  getSiteUserById: (id: number) => siteUsers.find(u => u.id === id),
  createSiteUser: (data: Omit<SiteUser, "id" | "createdAt">) => {
    const user = { ...data, id: nextId.siteUser++, createdAt: new Date().toISOString() };
    siteUsers.push(user);
    return user;
  },

  // Dashboard
    getDashboardStats: async () => {
    const db = getDb();
    const [teamsCount] = await db.select({ count: sql<number>`count(*)` }).from(teamsTable);
    const [playersCount] = await db.select({ count: sql<number>`count(*)` }).from(playersTable);
    const matchesList = matches;
    
    return {
      totalTeams: teamsCount?.count || 0,
      totalPlayers: playersCount?.count || 0,
      upcomingMatches: matchesList.filter(m => m.status === "upcoming").length,
      liveMatches: matchesList.filter(m => m.status === "live").length,
      finishedMatches: matchesList.filter(m => m.status === "finished").length,
    };
  },
};

export async function getNews(): Promise<News[]> {
  const db = getDb();
  // Автоматический сидинг: если новостей в базе 0, создаем две дефолтные про s1zzi и Major
  const existingNews = await db.select().from(newsTable).limit(1);
  if (existingNews.length === 0) {
    await db.insert(newsTable).values([
      { title: "Украинский талант s1zzi из B8 заявляет о целях на топ-3 HLTV", content: "16-летний украинский снайпер Данило s1zzi Винник, выступающий за команду B8, серьезно нацелен на мировую вершину Counter-Strike 2. Молодой АWPer показывает невероятный уровень индивидуальной игры.", imageUrl: "/news-2.png" },
      { title: "EFL Major 2025: Grand Finals Set", content: "Alpha Wolves and Dragon Gaming will face off in the championship match this weekend.", imageUrl: "/news-1.png" }
    ]);
  }
  return await db.select().from(newsTable);
}

export async function addNews(item: Omit<News, "id" | "createdAt">): Promise<News> {
  const db = getDb();
  const generatedId = Math.floor(Math.random() * 1000000) + 1;
  
  await db.insert(newsTable).values({
    id: generatedId,
    ...item
  });
  
  return { id: generatedId, createdAt: new Date(), ...item } as News;
}


export async function deleteNews(id: number): Promise<void> {
  await getDb().delete(newsTable).where(eq(newsTable.id, id));
}
