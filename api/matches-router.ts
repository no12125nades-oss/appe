import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { store } from "./store";

export const matchesRouter = createRouter({
  list: publicQuery
    .input(z.object({ status: z.string().optional() }).optional())
    .query(({ input }) => {
      return store.getMatches(input?.status);
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const match = store.getMatchById(input.id);
      if (!match) throw new Error("Match not found");
      const teamA = store.getTeamById(match.teamAId);
      const teamB = store.getTeamById(match.teamBId);
      const stats = store.getMatchStats(input.id);
      return { ...match, teamA, teamB, stats };
    }),

  create: publicQuery
    .input(z.object({
      teamAId: z.number(),
      teamBId: z.number(),
      tournament: z.string().min(1),
      scheduledAt: z.string(),
      status: z.enum(["upcoming", "live", "finished"]),
      scoreA: z.number().optional(),
      scoreB: z.number().optional(),
      mapPool: z.string().nullable().optional(),
      mvpPlayerId: z.number().nullable().optional(),
    }))
    .mutation(({ input }) => {
      return store.createMatch({
        ...input,
        scoreA: input.scoreA ?? 0,
        scoreB: input.scoreB ?? 0,
        mapPool: input.mapPool || null,
        mvpPlayerId: input.mvpPlayerId ?? null,
      });
    }),

  update: publicQuery
    .input(z.object({
      id: z.number(),
      teamAId: z.number().optional(),
      teamBId: z.number().optional(),
      tournament: z.string().optional(),
      scheduledAt: z.string().optional(),
      status: z.enum(["upcoming", "live", "finished"]).optional(),
      scoreA: z.number().optional(),
      scoreB: z.number().optional(),
      mapPool: z.string().nullable().optional(),
      mvpPlayerId: z.number().nullable().optional(),
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      const result = store.updateMatch(id, data);
      if (!result) throw new Error("Match not found");
      return result;
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const result = store.deleteMatch(input.id);
      if (!result) throw new Error("Match not found");
      return { success: true };
    }),
});
