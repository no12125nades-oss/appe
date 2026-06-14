import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { store } from "./store";

export const teamsRouter = createRouter({
  list: publicQuery
    .input(z.object({ tier: z.string().optional() }).optional())
    .query(({ input }) => {
      return store.getTeams(input?.tier);
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const team = store.getTeamById(input.id);
      if (!team) throw new Error("Team not found");
      return team;
    }),

  getWithRoster: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const team = store.getTeamById(input.id);
      if (!team) throw new Error("Team not found");
      const { store: _store } = require("./store");
      const allPlayers = _store.getPlayers();
      const roster = allPlayers.filter((p: { teamId: number | null }) => p.teamId === input.id);
      return { ...team, roster };
    }),

  create: publicQuery
    .input(z.object({
      name: z.string().min(1),
      region: z.string().min(1),
      tier: z.enum(["Tier 1", "Tier 2", "Tier 3"]),
      logoUrl: z.string().optional(),
      coach: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
    }))
    .mutation(({ input }) => {
      return store.createTeam({
        ...input,
        logoUrl: input.logoUrl || "/team-logo-1.png",
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        points: 1000,
        worldRank: null,
        coach: input.coach || null,
        description: input.description || null,
        trend: 0,
      });
    }),

  update: publicQuery
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      region: z.string().min(1).optional(),
      tier: z.enum(["Tier 1", "Tier 2", "Tier 3"]).optional(),
      logoUrl: z.string().optional(),
      coach: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
      points: z.number().optional(),
      trend: z.number().optional(),
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      const result = store.updateTeam(id, data);
      if (!result) throw new Error("Team not found");
      return result;
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const result = store.deleteTeam(input.id);
      if (!result) throw new Error("Team not found");
      return { success: true };
    }),
});
