import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../env.js";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      professionalId: number;
      role: string;
    };
  }
}

export async function jwtPlugin(app: FastifyInstance) {
  app.decorateRequest("user", undefined);

  app.addHook("preHandler", async (request: FastifyRequest) => {
    const token = request.cookies.access_token;
    if (!token) return;

    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as {
        professionalId: number;
        role: string;
      };
      request.user = payload;
    } catch {
      // Invalid token — user stays undefined
    }
  });
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) {
    return reply.status(401).send({ error: "Não autenticado", statusCode: 401 });
  }
}

export function requireRole(...roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({ error: "Não autenticado", statusCode: 401 });
    }
    if (!roles.includes(request.user.role)) {
      return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
    }
  };
}
