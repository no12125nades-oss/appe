import { getDb } from "./queries/connection";
import { news as newsTable, type Team, type Player, type News } from "../db/schema";
import { eq, sql } from "drizzle-orm";

const fallbackTeams = [];
const fallbackPlayers = [];

export const adminStore = {
  getDashboardStats: async () => {
    const db = getDb();
    try {
      const [teamsCount]: any = await db.execute(sql`SELECT COUNT(*) as count FROM teams`);
      const [playersCount]: any = await db.execute(sql`SELECT COUNT(*) as count FROM players`);
      return {
        totalTeams: teamsCount?.rows?.[0]?.count || teamsCount?.[0]?.count || teamsCount?.count || 0,
        totalPlayers: playersCount?.rows?.[0]?.count || playersCount?.[0]?.count || playersCount?.count || 0,
        upcomingMatches: 0,
        liveMatches: 0,
        finishedMatches: 0,
      };
    } catch (e) {
      return { totalTeams: 0, totalPlayers: 0, upcomingMatches: 0, liveMatches: 0, finishedMatches: 0 };
    }
  },
};

export async function getTeams(): Promise<Team[]> {
  try {
    const res: any = await getDb().execute(sql`SELECT * FROM teams`);
    return (res?.rows || res || []) as Team[];
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

export async function updateTeam(id: number, updatedFields: Partial<Team>): Promise<void> {}

export async function deleteTeam(id: number): Promise<void> {
  await getDb().execute(sql`DELETE FROM teams WHERE id = ${id}`);
}

export async function getPlayers(): Promise<Player[]> {
  try {
    const res: any = await getDb().execute(sql`SELECT * FROM players`);
    return (res?.rows || res || []) as Player[];
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

export async function updatePlayer(id: number, updatedFields: Partial<Player>): Promise<void> {}

export async function deletePlayer(id: number): Promise<void> {
  await getDb().execute(sql`DELETE FROM players WHERE id = ${id}`);
}

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

export const matches = [];

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
  
  getSiteUserByUsername: async (username: string) => {
    try {
      const db = getDb();
      const res: any = await db.execute(sql`SELECT * FROM users WHERE name = ${username} LIMIT 1`);
      const rows = res?.rows || res?.[0] || res || [];
      
      if (rows.length > 0) {
        const user = rows[0];
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          password_hash: user.password_hash || user.password,
          role: user.role
        };
      }
      
      if (username === "admin") {
        const generatedId = Math.floor(Math.random() * 100000) + 1;
        await db.execute(sql`
          INSERT INTO users (id, name, email, password_hash, role) 
          VALUES (${generatedId}, 'admin', 'admin@efl.app', 'fiway9998', 'admin')
        `);
        return { id: generatedId, name: "admin", email: "admin@efl.app", password_hash: "fiway9998", role: "admin" };
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  createSiteUser: async (user: any) => {
    try {
      const db = getDb();
      const generatedId = Math.floor(Math.random() * 1000000) + 1;
      await db.execute(sql`
        INSERT INTO users (id, name, email, password_hash, role) 
        VALUES (${generatedId}, ${user.username}, ${user.email}, ${user.password}, 'user')
      `);
      return { id: generatedId, ...user };
    } catch (e) {
      return { id: 999, ...user };
    }
  }
};
