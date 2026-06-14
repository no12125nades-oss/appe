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
      if (input.username === "admin" && input.password === "adminknjazx") {
        return {
          success: true,
          token: "admin-jwt-token-" + Date.now(),
          user: { id: 0, username: "admin", role: "admin" },
        };
      }
      throw new Error("Invalid admin credentials");
    }),

  dashboard: publicQuery.query(() => {
    return store.getDashboardStats();
  }),
});
