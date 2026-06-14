import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import {
  hashPassword,
  verifyPassword,
  signSessionToken,
  clearSessionCookie,
} from "./local-auth";
import {
  findUserByEmail,
  createUser,
  updateUserLastSignIn,
  getAllUsers,
} from "./queries/users";
import { getSessionCookieOptions } from "./lib/cookies";
import { Session } from "@contracts/constants";
import { setCookie } from "hono/cookie";

export const authRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        name: z.string().min(1, "Name is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existing = await findUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      const passwordHash = await hashPassword(input.password);
      const user = await createUser({
        email: input.email,
        passwordHash,
        name: input.name,
        role: "user",
      });

      const token = await signSessionToken(user.id);
      const cookieOpts = getSessionCookieOptions(ctx.req.headers);
      setCookie(ctx as any, Session.cookieName, token, {
        ...cookieOpts,
        maxAge: Session.maxAgeMs / 1000,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }),

  login: publicQuery
    .input(
      z.object({
        email: z.string().email("Invalid email"),
        password: z.string().min(1, "Password is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await findUserByEmail(input.email);
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const valid = await verifyPassword(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      await updateUserLastSignIn(user.id);

      const token = await signSessionToken(user.id);
      const cookieOpts = getSessionCookieOptions(ctx.req.headers);
      setCookie(ctx as any, Session.cookieName, token, {
        ...cookieOpts,
        maxAge: Session.maxAgeMs / 1000,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }),

  me: authedQuery.query(({ ctx }) => {
    return {
      id: ctx.user.id,
      email: ctx.user.email,
      name: ctx.user.name,
      avatar: ctx.user.avatar,
      role: ctx.user.role,
      createdAt: ctx.user.createdAt,
    };
  }),

  logout: authedQuery.mutation(({ ctx }) => {
    const cookie = clearSessionCookie(ctx.req.headers);
    ctx.resHeaders.append("set-cookie", cookie);
    return { success: true };
  }),

  listUsers: authedQuery.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required",
      });
    }
    return getAllUsers();
  }),
});
