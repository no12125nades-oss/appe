import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { store } from "./store";

export const playersRouter = createRouter({
  list: publicQuery
    .input(z.object({
      tier: z.string().optional(),
      role: z.string().optional(),
    }).optional())
    .query(({ input }) => {
      return store.getPlayers(input?.tier, input?.role);
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const player = store.getPlayerById(input.id);
      if (!player) throw new Error("Player not found");
      return player;
    }),

  getWithTeam: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const player = store.getPlayerById(input.id);
      if (!player) throw new Error("Player not found");
      const team = player.teamId ? store.getTeamById(player.teamId) : null;
      return { ...player, team };
    }),

  create: publicQuery
    .input(z.object({
      name: z.string().min(1),
      nickname: z.string().min(1),
      nationality: z.string().min(1),
      role: z.enum(["AWPer", "Entry", "IGL", "Lurk", "Support"]),
      teamId: z.number().nullable().optional(),
      tier: z.enum(["Tier 1", "Tier 2", "Tier 3"]),
      avatarUrl: z.string().nullable().optional(),
      rating: z.number().optional(),
      kdRatio: z.number().optional(),
      adr: z.number().optional(),
      kast: z.number().optional(),
      mapsPlayed: z.number().optional(),
      mvpCount: z.number().optional(),
    }))
    .mutation(({ input }) => {
      return store.createPlayer({
        ...input,
        teamId: input.teamId ?? null,
        avatarUrl: input.avatarUrl || null,
        rating: input.rating ?? 1.0,
        kdRatio: input.kdRatio ?? 1.0,
        adr: input.adr ?? 80,
        kast: input.kast ?? 70,
        mapsPlayed: input.mapsPlayed ?? 0,
        mvpCount: input.mvpCount ?? 0,
      });
    }),

  update: publicQuery
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      nickname: z.string().min(1).optional(),
      nationality: z.string().min(1).optional(),
      role: z.enum(["AWPer", "Entry", "IGL", "Lurk", "Support"]).optional(),
      teamId: z.number().nullable().optional(),
      tier: z.enum(["Tier 1", "Tier 2", "Tier 3"]).optional(),
      avatarUrl: z.string().nullable().optional(),
      rating: z.number().optional(),
      kdRatio: z.number().optional(),
      adr: z.number().optional(),
      kast: z.number().optional(),
      mapsPlayed: z.number().optional(),
      mvpCount: z.number().optional(),
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      const result = store.updatePlayer(id, data);
      if (!result) throw new Error("Player not found");
      return result;
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const result = store.deletePlayer(input.id);
      if (!result) throw new Error("Player not found");
      return { success: true };
    }),

  uploadAvatar: publicQuery
    .input(z.object({
      id: z.number(),
      avatarUrl: z.string(),
    }))
    .mutation(({ input }) => {
      const result = store.updatePlayer(input.id, { avatarUrl: input.avatarUrl });
      if (!result) throw new Error("Player not found");
      return result;
    }),
});
