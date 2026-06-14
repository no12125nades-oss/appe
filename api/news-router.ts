import { createRouter, publicQuery } from "./middleware";
import { getNews, addNews, deleteNews } from "./store";
import { z } from "zod";

export const newsRouter = createRouter({
  list: publicQuery
    .query(async () => {
      return await getNews();
    }),

  create: publicQuery
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

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteNews(input.id);
      return { success: true };
    }),
});
