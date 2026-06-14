// Re-export Drizzle types for existing auth system
import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// App types
export type Tier = "Tier 1" | "Tier 2" | "Tier 3";
export type Role = "AWPer" | "Entry" | "IGL" | "Lurk" | "Support";
export type MatchStatus = "upcoming" | "live" | "finished";

export interface Team {
  id: number;
  name: string;
  region: string;
  tier: Tier;
  logoUrl: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  points: number;
  worldRank: number | null;
  coach: string | null;
  description: string | null;
  trend: number;
}

export interface Player {
  id: number;
  name: string;
  nickname: string;
  nationality: string;
  role: Role;
  teamId: number | null;
  tier: Tier;
  avatarUrl: string | null;
  rating: number;
  kdRatio: number;
  adr: number;
  kast: number;
  mapsPlayed: number;
  mvpCount: number;
}

export interface Match {
  id: number;
  teamAId: number;
  teamBId: number;
  tournament: string;
  scheduledAt: string;
  status: MatchStatus;
  scoreA: number;
  scoreB: number;
  mapPool: string | null;
  mvpPlayerId: number | null;
}

export interface MatchStat {
  id: number;
  matchId: number;
  playerId: number;
  teamId: number;
  kills: number;
  deaths: number;
  assists: number;
  adr: number;
  rating: number;
}

export interface SiteUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  teamId: number | null;
  rating: number;
  matchesPlayed: number;
  wins: number;
  createdAt: string;
}
export const news = mysqlTable("news", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;
