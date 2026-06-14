import { createRouter, publicQuery } from "./middleware";
import { getNews, addNews, deleteNews } from "./store";
import { z } from "zod";
import { adminMutation } from "./middleware";

export const newsRouter = createRouter({
  list: publicQuery.query(async () => {
    return await getNews();
  }),

  create: adminMutation
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await addNews(input);
    }),

  delete: adminMutation
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteNews(input.id);
      return { success: true };
    }),
});
