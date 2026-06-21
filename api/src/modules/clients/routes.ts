import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createAbility } from "../../lib/ability.js";
import { requireAuth, requireRole } from "../../lib/plugins/auth.js";
import { createClientSchema, updateClientSchema } from "./schema.js";
import * as clientsService from "./service.js";

export async function clientsRoutes(app: FastifyInstance) {
  app.get(
    "/api/clients",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // biome-ignore lint/style/noNonNullAssertion: requireAuth ensures user is defined
      const user = request.user!;
      const query = request.query as { q?: string };

      const ability = createAbility(user.role, user.professionalId);
      if (!ability.can("read", "Client")) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      const list = await clientsService.search(query.q);
      return list;
    },
  );

  app.post(
    "/api/clients",
    { preHandler: [requireAuth, requireRole("OWNER")] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const input = createClientSchema.parse(request.body);
      const client = await clientsService.create(input);
      return reply.status(201).send(client);
    },
  );

  app.put(
    "/api/clients/:id",
    { preHandler: [requireAuth, requireRole("OWNER")] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const id = Number((request.params as { id: string }).id);

      if (Number.isNaN(id)) {
        return reply.status(400).send({ error: "ID inválido", statusCode: 400 });
      }

      const existing = await clientsService.getById(id);
      if (!existing) {
        return reply.status(404).send({ error: "Cliente não encontrado", statusCode: 404 });
      }

      const input = updateClientSchema.parse(request.body);
      const client = await clientsService.update(id, input);
      return client;
    },
  );

  app.get(
    "/api/clients/:id/history",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const id = Number((request.params as { id: string }).id);

      if (Number.isNaN(id)) {
        return reply.status(400).send({ error: "ID inválido", statusCode: 400 });
      }

      const client = await clientsService.getById(id);
      if (!client) {
        return reply.status(404).send({ error: "Cliente não encontrado", statusCode: 404 });
      }

      return { client, appointments: [] };
    },
  );
}
