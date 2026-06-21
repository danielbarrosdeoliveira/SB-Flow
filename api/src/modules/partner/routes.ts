import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { requireAuth, requireRole } from "../../lib/plugins/auth.js";
import {
  createProfessionalSchema,
  ownerUpdateProfessionalSchema,
  updateProfessionalSchema,
} from "./schema.js";
import * as partnerService from "./service.js";

export async function partnerRoutes(app: FastifyInstance) {
  app.get(
    "/api/professionals",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { user } = request;

      if (user?.role === "OWNER") {
        const list = await partnerService.listAll();
        return list.map(({ passwordHash, ...rest }) => rest);
      }

      // biome-ignore lint/style/noNonNullAssertion: requireAuth ensures user is defined
      const list = await partnerService.listOwn(user!.professionalId);
      return list.map(({ passwordHash, ...rest }) => rest);
    },
  );

  app.get(
    "/api/professionals/mine",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // biome-ignore lint/style/noNonNullAssertion: requireAuth ensures user is defined
      const professional = await partnerService.getById(request.user!.professionalId);
      if (!professional) {
        return reply.status(404).send({ error: "Profissional não encontrada", statusCode: 404 });
      }
      const { passwordHash, ...rest } = professional;
      return rest;
    },
  );

  app.get(
    "/api/professionals/:id",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { user } = request;
      const id = Number((request.params as { id: string }).id);

      if (Number.isNaN(id)) {
        return reply.status(400).send({ error: "ID inválido", statusCode: 400 });
      }

      if (user?.role !== "OWNER" && user?.professionalId !== id) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      const professional = await partnerService.getById(id);
      if (!professional) {
        return reply.status(404).send({ error: "Profissional não encontrada", statusCode: 404 });
      }

      const { passwordHash, ...rest } = professional;
      return rest;
    },
  );

  app.post(
    "/api/professionals",
    { preHandler: [requireAuth, requireRole("OWNER")] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const input = createProfessionalSchema.parse(request.body);
      const professional = await partnerService.create(input);
      const { passwordHash, ...rest } = professional;
      return reply.status(201).send(rest);
    },
  );

  app.put(
    "/api/professionals/:id",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { user } = request;
      const id = Number((request.params as { id: string }).id);
      const isOwner = user?.role === "OWNER";

      if (Number.isNaN(id)) {
        return reply.status(400).send({ error: "ID inválido", statusCode: 400 });
      }

      if (!isOwner && user?.professionalId !== id) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      const schema = isOwner ? ownerUpdateProfessionalSchema : updateProfessionalSchema;
      const input = schema.parse(request.body);

      const professional = await partnerService.update(id, input, isOwner);
      if (!professional) {
        return reply.status(404).send({ error: "Profissional não encontrada", statusCode: 404 });
      }

      const { passwordHash, ...rest } = professional;
      return rest;
    },
  );

  app.patch(
    "/api/professionals/:id/toggle-active",
    { preHandler: [requireAuth, requireRole("OWNER")] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const id = Number((request.params as { id: string }).id);

      if (Number.isNaN(id)) {
        return reply.status(400).send({ error: "ID inválido", statusCode: 400 });
      }

      const professional = await partnerService.toggleActive(id);
      if (!professional) {
        return reply.status(404).send({ error: "Profissional não encontrada", statusCode: 404 });
      }
      const { passwordHash, ...rest } = professional;
      return rest;
    },
  );
}
