import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createAbility } from "../../lib/ability.js";
import { requireAuth } from "../../lib/plugins/auth.js";
import { createServiceSchema, updateServiceSchema } from "./schema.js";
import * as servicesService from "./service.js";

export async function servicesRoutes(app: FastifyInstance) {
  app.get(
    "/api/services",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // biome-ignore lint/style/noNonNullAssertion: requireAuth ensures user is defined
      const user = request.user!;
      const query = request.query as { professional_id?: string };
      const professionalId = query.professional_id ? Number(query.professional_id) : undefined;

      const ability = createAbility(user.role, user.professionalId);

      if (professionalId !== undefined && !ability.can("read", "Service")) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      if (
        user.role === "PARTNER" &&
        professionalId !== undefined &&
        professionalId !== user.professionalId
      ) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      const filterProfessionalId =
        user.role === "PARTNER" && professionalId === undefined
          ? user.professionalId
          : professionalId;

      const list = await servicesService.list(filterProfessionalId);
      return list;
    },
  );

  app.post(
    "/api/services",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // biome-ignore lint/style/noNonNullAssertion: requireAuth ensures user is defined
      const user = request.user!;
      const input = createServiceSchema.parse(request.body);

      const ability = createAbility(user.role, user.professionalId);
      if (!ability.can("create", "Service")) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      if (user.role === "PARTNER" && input.professionalId !== user.professionalId) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      const service = await servicesService.create(input);
      return reply.status(201).send(service);
    },
  );

  app.put(
    "/api/services/:id",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // biome-ignore lint/style/noNonNullAssertion: requireAuth ensures user is defined
      const user = request.user!;
      const id = Number((request.params as { id: string }).id);

      if (Number.isNaN(id)) {
        return reply.status(400).send({ error: "ID inválido", statusCode: 400 });
      }

      const existing = await servicesService.getById(id);
      if (!existing) {
        return reply.status(404).send({ error: "Serviço não encontrado", statusCode: 404 });
      }

      const ability = createAbility(user.role, user.professionalId);
      if (!ability.can("update", "Service")) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      if (user.role === "PARTNER" && existing.professionalId !== user.professionalId) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      const input = updateServiceSchema.parse(request.body);
      const service = await servicesService.update(id, input);
      return service;
    },
  );

  app.delete(
    "/api/services/:id",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // biome-ignore lint/style/noNonNullAssertion: requireAuth ensures user is defined
      const user = request.user!;
      const id = Number((request.params as { id: string }).id);

      if (Number.isNaN(id)) {
        return reply.status(400).send({ error: "ID inválido", statusCode: 400 });
      }

      const existing = await servicesService.getById(id);
      if (!existing) {
        return reply.status(404).send({ error: "Serviço não encontrado", statusCode: 404 });
      }

      const ability = createAbility(user.role, user.professionalId);
      if (!ability.can("delete", "Service")) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      if (user.role === "PARTNER" && existing.professionalId !== user.professionalId) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      const service = await servicesService.softDelete(id);
      return service;
    },
  );
}
