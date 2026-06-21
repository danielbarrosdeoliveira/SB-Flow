import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { env } from "../../lib/env.js";
import { loginSchema, refreshSchema } from "./schema.js";
import { AuthError, login, refresh } from "./service.js";

const cookieOpts = (maxAge: number) => ({
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.NODE_ENV === "production",
  maxAge,
});

export async function authRoutes(app: FastifyInstance) {
  app.post("/api/auth/login", async (request: FastifyRequest, reply: FastifyReply) => {
    const input = loginSchema.parse(request.body);

    try {
      const result = await login(input);

      reply.setCookie("access_token", result.accessToken, cookieOpts(900));
      reply.setCookie("refresh_token", result.refreshToken, cookieOpts(30 * 24 * 60 * 60));

      return { user: result.user };
    } catch (error) {
      if (error instanceof AuthError) {
        return reply.status(401).send({ error: error.message, statusCode: 401 });
      }
      throw error;
    }
  });

  app.post("/api/auth/refresh", async (request: FastifyRequest, reply: FastifyReply) => {
    const { refreshToken } = refreshSchema.parse({
      refreshToken: request.cookies.refresh_token,
    });

    if (!refreshToken) {
      return reply.status(401).send({ error: "Sessão expirada", statusCode: 401 });
    }

    try {
      const result = await refresh(refreshToken);

      reply.setCookie("access_token", result.accessToken, cookieOpts(900));
      reply.setCookie("refresh_token", result.refreshToken, cookieOpts(30 * 24 * 60 * 60));

      return { ok: true };
    } catch (error) {
      if (error instanceof AuthError) {
        return reply.status(401).send({ error: error.message, statusCode: 401 });
      }
      throw error;
    }
  });

  app.post("/api/auth/logout", async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie("access_token", { path: "/" });
    reply.clearCookie("refresh_token", { path: "/" });
    return { ok: true };
  });
}
