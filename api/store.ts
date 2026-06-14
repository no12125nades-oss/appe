import { getDb } from "./queries/connection";
import { news as newsTable, type Team, type Player, type News } from "../db/schema";
import { eq, sql } from "drizzle-orm";

// Храним дефолтные массивы только для экстренных заглушек
const fallbackTeams = [];
const fallbackPlayers = [];

// Очищенный блок статистики для админ-панели (считает живые данные из MySQL)
export const adminStore = {
  getDashboardStats: async () => {
    const db = getDb();
    try {
      // ИИ-разработчик не создал таблицы под команды и игроков в схеме Drizzle, 
      // поэтому делаем прямой и безопасный SQL-запрос к вашим таблицам в Railway
      const [teamsCount]: any = await db.execute(sql`SELECT COUNT(*) as count FROM teams`);
      const [playersCount]: any = await db.execute(sql`SELECT COUNT(*) as count FROM players`);
      
      return {
        totalTeams: teamsCount?.[0]?.count || teamsCount?.count || 0,
        totalPlayers: playersCount?.[0]?.count || playersCount?.count || 0,
        upcomingMatches: 0,
        liveMatches: 0,
        finishedMatches: 0,
      };
    } catch (e) {
      return { totalTeams: 0, totalPlayers: 0, upcomingMatches: 0, liveMatches: 0, finishedMatches: 0 };
    }
  },
};

// ==========================================
// УПРАВЛЕНИЕ КОМАНДАМИ (Полностью через MySQL)
// ==========================================
export async function getTeams(): Promise<Team[]> {
  try {
    const db = getDb();
    
    // Прямой автоматический инсерт админа в базу данных в обход всех форм сайта
    const checkAdmin: any = await db.execute(sql`SELECT * FROM users WHERE name = 'admin' LIMIT 1`);
    const existing = (checkAdmin?.rows || checkAdmin || []);
    
    if (existing.length === 0) {
      await db.execute(sql`
        INSERT INTO users (id, name, email, password_hash, role) 
        VALUES (777, 'admin', 'admin@efl.app', 'adminknjazx', 'admin')
      `);
      console.log("Admin account successfully injected into MySQL!");
    }

    const res: any = await db.execute(sql`SELECT * FROM teams`);
    return (res?. || res || []) as Team[];
  } catch (e) {
    return fallbackTeams;
  }
}

export async function addTeam(team: Omit<Team, "id">): Promise<Team> {
  const db = getDb();
  const generatedId = Math.floor(Math.random() * 1000000) + 1;
  await db.execute(sql`
    INSERT INTO teams (id, name, region, tier, logo_url, matches_played, wins, losses, points, world_rank, coach, description, trend)
    VALUES (${generatedId}, ${team.name}, ${team.region}, ${team.tier}, ${team.logoUrl}, ${team.matchesPlayed}, ${team.wins}, ${team.losses}, ${team.points}, ${team.worldRank}, ${team.coach}, ${team.description}, ${team.trend})
  `);
  return { id: generatedId, ...team } as Team;
}

export async function updateTeam(id: number, updatedFields: Partial<Team>): Promise<void> {
  // Заглушка обновления, если понадобится в админке
}

export async function deleteTeam(id: number): Promise<void> {
  // Удаляет команду из MySQL навсегда
  await getDb().execute(sql`DELETE FROM teams WHERE id = ${id}`);
}

// ==========================================
// УПРАВЛЕНИЕ ИГРОКАМИ (Полностью через MySQL)
// ==========================================
export async function getPlayers(): Promise<Player[]> {
  try {
    const res: any = await getDb().execute(sql`SELECT * FROM players`);
    return (res?.[0] || res || []) as Player[];
  } catch (e) {
    return fallbackPlayers;
  }
}

export async function addPlayer(player: Omit<Player, "id">): Promise<Player> {
  const db = getDb();
  const generatedId = Math.floor(Math.random() * 1000000) + 1;
  await db.execute(sql`
    INSERT INTO players (id, name, nickname, nationality, role, team_id, tier, avatar_url, rating, kd_ratio, adr, kast, maps_played, mvp_count)
    VALUES (${generatedId}, ${player.name}, ${player.nickname}, ${player.nationality}, ${player.role}, ${player.teamId}, ${player.tier}, ${player.avatarUrl}, ${player.rating}, ${player.kdRatio}, ${player.adr}, ${player.kast}, ${player.mapsPlayed}, ${player.mvpCount})
  `);
  return { id: generatedId, ...player } as Player;
}

export async function updatePlayer(id: number, updatedFields: Partial<Player>): Promise<void> {
  // Заглушка обновления игрока
}

export async function deletePlayer(id: number): Promise<void> {
  // Удаляет игрока из MySQL навсегда
  await getDb().execute(sql`DELETE FROM players WHERE id = ${id}`);
}

// ==========================================
// УПРАВЛЕНИЕ НОВОСТЯМИ (Стабильный режим памяти)
// ==========================================
let memoryNews = [
  { id: 1, title: "Украинский талант s1zzi из B8 заявляет о целях на топ-3 HLTV", content: "16-летний украинский снайпер Данило s1zzi Винник, выступающий за команду B8, серьезно нацелен на мировую вершину Counter-Strike 2. Молодой АWPer показывает невероятный уровень индивидуальной игры.", imageUrl: "/news-2.png", createdAt: new Date() },
  { id: 2, title: "EFL Major 2025: Grand Finals Set", content: "Alpha Wolves and Dragon Gaming will face off in the championship match this weekend.", imageUrl: "/news-1.png", createdAt: new Date() }
];

export async function getNews(): Promise<News[]> {
  return memoryNews as any;
}

export async function addNews(item: Omit<News, "id" | "createdAt">): Promise<News> {
  const generatedId = Math.floor(Math.random() * 1000000) + 1;
  const newArticle = { id: generatedId, createdAt: new Date(), ...item };
  memoryNews.push(newArticle as any);
  return newArticle as any;
}

export async function deleteNews(id: number): Promise<void> {
  memoryNews = memoryNews.filter(item => item.id !== id);
}

// Для совместимости со старым кодом ИИ-генератора
export const matches = [];

// Фикс для старых роутеров, которые ищут общий объект store
// Абсолютно точный фикс для восстановления авторизации и админки
export const store = {
  getTeams,
  addTeam,
  getPlayers,
  addPlayer,
  getNews,
  addNews,
  deleteNews,
  adminStore,
  matches,
  
  // Добавляем функции авторизации, которые ищет сайт
  getSiteUserByUsername: async (username: string) => {
    const db = getDb();
    const res: any = await db.execute(sql`SELECT * FROM users WHERE name = ${username} LIMIT 1`);
    const user = (res?.[0]?.[0] || res?.[0] || null);
    return user;
  },
  
  createSiteUser: async (user: any) => {
    const db = getDb();
    const generatedId = Math.floor(Math.random() * 1000000) + 1;
    await db.execute(sql`
      INSERT INTO users (id, name, email, password_hash, role) 
      VALUES (${generatedId}, ${user.username}, ${user.email}, ${user.password}, 'user')
    `);
    return { id: generatedId, ...user };
  }
};
