import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { store } from "./store";

export const adminRouter = createRouter({
  login: publicQuery
    .input(z.object({
      username: z.string(),
      password: z.string(),
    }))
    .mutation(({ input }) => {
          if (input.username === "admin" && input.password === "fiway9998") {
      return {
        success: true,
        token: "admin-jwt-token-" + Date.now(),
        user: { id: 0, username: "admin", role: "admin" },
      };
    }
    throw new Error("Invalid username or password");
    }),

  dashboard: publicQuery.query(() => {
    return store.getDashboardStats();
  }),
});
