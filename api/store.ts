import { news as newsTable, type Team, type Player, type News } from "../db/schema";

// База данных в памяти сервера (State) — Команды
let memoryTeams: Team[] = [
  { id: 1, name: "Alpha Wolves", region: "Europe", tier: "Tier 1", logoUrl: "/team-logo-1.png", matchesPlayed: 42, wins: 35, losses: 7, points: 1245, worldRank: 1, coach: "Alex Kovacs", description: "Top European CS2 team", trend: 1 },
  { id: 2, name: "Eagle Esports", region: "North America", tier: "Tier 1", logoUrl: "/team-logo-2.png", matchesPlayed: 38, wins: 30, losses: 8, points: 1201, worldRank: 2, coach: "John Smith", description: "NA powerhouse", trend: 0 }
];

// База данных в памяти сервера (State) — Игроки
let memoryPlayers: Player[] = [
  { id: 1, name: "Alexander Petrov", nickname: "S1mpleX", nationality: "Ukraine", role: "AWPer", teamId: 1, tier: "Tier 1", avatarUrl: "/player-1.png", rating: 1.35, kdRatio: 1.42, adr: 92.5, kast: 78.2, mapsPlayed: 38, mvpCount: 12 },
  { id: 2, name: "Danil Kryshkovets", nickname: "donk", nationality: "Russia", role: "Rifler", teamId: 1, tier: "Tier 1", avatarUrl: "/player-2.png", rating: 1.25, kdRatio: 1.30, adr: 89.2, kast: 75.4, mapsPlayed: 40, mvpCount: 8 }
];

// База данных в памяти сервера (State) — Новости
let memoryNews = [
  { id: 1, title: "Украинский талант s1zzi из B8 заявляет о целях на топ-3 HLTV", content: "16-летний украинский снайпер Данило s1zzi Винник, выступающий за команду B8, серьезно нацелен на мировую вершину Counter-Strike 2. Молодой АWPer показывает невероятный уровень индивидуальной игры.", imageUrl: "/news-2.png", createdAt: new Date() },
  { id: 2, title: "EFL Major 2025: Grand Finals Set", content: "Alpha Wolves and Dragon Gaming will face off in the championship match this weekend.", imageUrl: "/news-1.png", createdAt: new Date() }
];

// Статистика админ-панели
export const adminStore = {
  getDashboardStats: async () => {
    return {
      totalTeams: memoryTeams.length,
      totalPlayers: memoryPlayers.length,
      upcomingMatches: 0,
      liveMatches: 0,
      finishedMatches: 0,
    };
  },
};

// Функции управления командами
export async function getTeams(): Promise<Team[]> { return memoryTeams; }
export async function addTeam(team: Omit<Team, "id">): Promise<Team> {
  const id = Math.floor(Math.random() * 1000000) + 1;
  const newTeam = { id, ...team } as Team;
  memoryTeams.push(newTeam);
  return newTeam;
}
export async function deleteTeam(id: number): Promise<void> {
  memoryTeams = memoryTeams.filter(t => t.id !== id);
}

// Функции управления игроками
export async function getPlayers(): Promise<Player[]> { return memoryPlayers; }
export async function addPlayer(player: Omit<Player, "id">): Promise<Player> {
  const id = Math.floor(Math.random() * 1000000) + 1;
  const newPlayer = { id, ...player } as Player;
  memoryPlayers.push(newPlayer);
  return newPlayer;
}
export async function deletePlayer(id: number): Promise<void> {
  memoryPlayers = memoryPlayers.filter(p => p.id !== id);
}

// Функции управления новостями
export async function getNews(): Promise<News[]> { return memoryNews as any; }
export async function addNews(item: Omit<News, "id" | "createdAt">): Promise<News> {
  const id = Math.floor(Math.random() * 1000000) + 1;
  const newArticle = { id, createdAt: new Date(), ...item };
  memoryNews.push(newArticle as any);
  return newArticle as any;
}
export async function deleteNews(id: number): Promise<void> {
  memoryNews = memoryNews.filter(item => item.id !== id);
}

export const matches = [];

// Единый глобальный объект экспорта для всех роутеров сайта
export const store = {
  getTeams,
  addTeam,
  deleteTeam,
  getPlayers,
  addPlayer,
  deletePlayer,
  getNews,
  addNews,
  deleteNews,
  adminStore,
  matches,
  
  getSiteUserByUsername: async (username: string) => {
    if (username === "admin") {
      return { id: 777, name: "admin", email: "admin@efl.app", password_hash: "fiway9998", role: "admin" };
    }
    return null;
  },
  
  createSiteUser: async (user: any) => {
    return { id: 999, ...user };
  }
};
