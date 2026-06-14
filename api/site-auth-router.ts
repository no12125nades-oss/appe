import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { store } from "./store";

export const siteAuthRouter = createRouter({
  register: publicQuery
    .input(z.object({
      username: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(4),
    }))
    .mutation(({ input }) => {
      const existing = store.getSiteUserByUsername(input.username);
      if (existing) throw new Error("Username already taken");
      const user = store.createSiteUser({
        username: input.username,
        email: input.email,
        password: input.password,
        role: "user",
        teamId: null,
        rating: 1.0,
        matchesPlayed: 0,
        wins: 0,
      });
      return {
        token: "user-jwt-" + user.id + "-" + Date.now(),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    }),

  login: publicQuery
    .input(z.object({
      username: z.string(),
      password: z.string(),
    }))
    .mutation(({ input }) => {
      const user = store.getSiteUserByUsername(input.username);
      if (!user || user.password !== input.password) {
        throw new Error("Invalid username or password");
      }
      return {
        token: "user-jwt-" + user.id + "-" + Date.now(),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    }),

  me: publicQuery
    .input(z.object({ token: z.string() }).optional())
    .query(({ input }) => {
      if (!input?.token) return null;
      // Parse token to get user id
      const match = input.token.match(/user-jwt-(\d+)-/);
      if (!match) {
        // Check admin token
        if (input.token.startsWith("admin-jwt-token-")) {
          return { id: 0, username: "admin", role: "admin" };
        }
        return null;
      }
      const userId = parseInt(match[1]);
      const user = store.getSiteUserById(userId);
      if (!user) return null;
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        teamId: user.teamId,
        rating: user.rating,
        matchesPlayed: user.matchesPlayed,
        wins: user.wins,
      };
    }),
});
