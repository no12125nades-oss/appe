import { authRouter } from "./auth-router";
import { siteAuthRouter } from "./site-auth-router";
import { teamsRouter } from "./teams-router";
import { playersRouter } from "./players-router";
import { matchesRouter } from "./matches-router";
import { adminRouter } from "./admin-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  siteAuth: siteAuthRouter,
  teams: teamsRouter,
  players: playersRouter,
  matches: matchesRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
