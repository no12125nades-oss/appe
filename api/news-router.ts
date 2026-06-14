import { router, publicProcedure, adminProcedure } from "./router";
import { getNews, addNews, deleteNews } from "./store";
import { z } from "zod";

export const newsRouter = router({
  // Получение списка новостей для главной страницы
  list: publicProcedure.query(async () => {
    return await getNews();
  }),

  // Добавление новости (доступно только админу)
  create: adminProcedure
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

  // Удаление новости по ID (доступно только админу)
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteNews(input.id);
      return { success: true };
    }),
});
