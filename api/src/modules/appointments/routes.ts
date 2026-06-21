import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createAbility } from "../../lib/ability.js";
import { requireAuth } from "../../lib/plugins/auth.js";
import { broadcastToProfessional } from "../../lib/sse-manager.js";
import {
  cancelAppointmentSchema,
  createAppointmentSchema,
  setStatusSchema,
  updateAppointmentSchema,
} from "./schema.js";
import * as appointmentsService from "./service.js";

export async function appointmentsRoutes(app: FastifyInstance) {
  app.get(
    "/api/appointments",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // biome-ignore lint/style/noNonNullAssertion: requireAuth ensures user is defined
      const user = request.user!;
      const query = request.query as {
        professional_id?: string;
        start?: string;
        end?: string;
      };

      const ability = createAbility(user.role, user.professionalId);
      if (!ability.can("read", "Appointment")) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      const professionalId = query.professional_id ? Number(query.professional_id) : undefined;

      const list = await appointmentsService.list({
        professionalId,
        start: query.start,
        end: query.end,
      });

      return list;
    },
  );

  app.post(
    "/api/appointments",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // biome-ignore lint/style/noNonNullAssertion: requireAuth ensures user is defined
      const user = request.user!;
      const input = createAppointmentSchema.parse(request.body);

      const ability = createAbility(user.role, user.professionalId);
      if (!ability.can("create", "Appointment")) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      if (user.role === "PARTNER" && input.professionalId !== user.professionalId) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      const appointment = await appointmentsService.create(input);
      broadcastToProfessional(appointment.professionalId, "appointment:created", appointment);
      return reply.status(201).send(appointment);
    },
  );

  app.put(
    "/api/appointments/:id",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // biome-ignore lint/style/noNonNullAssertion: requireAuth ensures user is defined
      const user = request.user!;
      const id = Number((request.params as { id: string }).id);

      if (Number.isNaN(id)) {
        return reply.status(400).send({ error: "ID inválido", statusCode: 400 });
      }

      const existing = await appointmentsService.getById(id);
      if (!existing) {
        return reply.status(404).send({ error: "Agendamento não encontrado", statusCode: 404 });
      }

      const ability = createAbility(user.role, user.professionalId);
      if (!ability.can("update", "Appointment")) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      if (user.role === "PARTNER" && existing.professionalId !== user.professionalId) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      const input = updateAppointmentSchema.parse(request.body);
      const appointment = await appointmentsService.update(id, input);
      if (!appointment) {
        return reply.status(404).send({ error: "Agendamento não encontrado", statusCode: 404 });
      }
      broadcastToProfessional(appointment.professionalId, "appointment:updated", appointment);
      return appointment;
    },
  );

  app.patch(
    "/api/appointments/:id/cancel",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // biome-ignore lint/style/noNonNullAssertion: requireAuth ensures user is defined
      const user = request.user!;
      const id = Number((request.params as { id: string }).id);

      if (Number.isNaN(id)) {
        return reply.status(400).send({ error: "ID inválido", statusCode: 400 });
      }

      const existing = await appointmentsService.getById(id);
      if (!existing) {
        return reply.status(404).send({ error: "Agendamento não encontrado", statusCode: 404 });
      }

      const ability = createAbility(user.role, user.professionalId);
      if (!ability.can("cancel", "Appointment")) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      if (user.role === "PARTNER" && existing.professionalId !== user.professionalId) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      const appointment = await appointmentsService.cancel(id, user.professionalId);
      if (!appointment) {
        return reply.status(404).send({ error: "Agendamento não encontrado", statusCode: 404 });
      }
      broadcastToProfessional(appointment.professionalId, "appointment:cancelled", appointment);
      return appointment;
    },
  );

  app.patch(
    "/api/appointments/:id/status",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // biome-ignore lint/style/noNonNullAssertion: requireAuth ensures user is defined
      const user = request.user!;
      const id = Number((request.params as { id: string }).id);

      if (Number.isNaN(id)) {
        return reply.status(400).send({ error: "ID inválido", statusCode: 400 });
      }

      const existing = await appointmentsService.getById(id);
      if (!existing) {
        return reply.status(404).send({ error: "Agendamento não encontrado", statusCode: 404 });
      }

      const ability = createAbility(user.role, user.professionalId);
      if (!ability.can("setStatus", "Appointment")) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      if (user.role === "PARTNER" && existing.professionalId !== user.professionalId) {
        return reply.status(403).send({ error: "Acesso negado", statusCode: 403 });
      }

      const input = setStatusSchema.parse(request.body);
      const appointment = await appointmentsService.setStatus(id, input.status);
      if (!appointment) {
        return reply.status(404).send({ error: "Agendamento não encontrado", statusCode: 404 });
      }
      broadcastToProfessional(appointment.professionalId, "appointment:status-changed", appointment);
      return appointment;
    },
  );
}
