import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { requireAuth, requireRole } from "../../../lib/plugins/auth.js";
import { createBlockSchema } from "./schema.js";
import * as blocksService from "./service.js";

export async function blocksRoutes(app: FastifyInstance) {
  app.get(
    "/api/blocks",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = request.query as {
        professional_id?: string;
        start?: string;
        end?: string;
      };

      const professionalId = query.professional_id ? Number(query.professional_id) : undefined;

      // PARTNER can only see their own blocks
      if (
        request.user?.role !== "OWNER" &&
        professionalId !== undefined &&
        professionalId !== request.user?.professionalId
      ) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      const list = await blocksService.list({
        professionalId,
        start: query.start,
        end: query.end,
      });

      return list;
    },
  );

  app.post(
    "/api/blocks",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user;
      if (!user) return reply.status(401).send({ error: "Não autenticado", statusCode: 401 });

      const input = createBlockSchema.parse(request.body);
      const isOwner = user.role === "OWNER";
      const professionalId = input.professionalId ?? user.professionalId;

      if (!isOwner && professionalId !== user.professionalId) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      const result = await blocksService.create({ ...input, professionalId });
      return reply.status(201).send(result);
    },
  );

  app.delete(
    "/api/blocks/:id",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user;
      if (!user) return reply.status(401).send({ error: "Não autenticado", statusCode: 401 });

      const id = Number((request.params as { id: string }).id);

      if (Number.isNaN(id)) {
        return reply.status(400).send({ error: "ID inválido", statusCode: 400 });
      }

      const deleted = await blocksService.deleteById(
        id,
        user.role !== "OWNER" ? user.professionalId : undefined,
      );
      if (!deleted) {
        return reply.status(404).send({ error: "Bloqueio não encontrado", statusCode: 404 });
      }

      return { ok: true };
    },
  );
}
