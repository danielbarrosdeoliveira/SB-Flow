import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { broadcastToProfessional } from "../../lib/sse-manager.js";
import { cancelBookingAppointmentSchema, createBookingAppointmentSchema } from "./schema.js";
import * as bookingService from "./service.js";

export async function bookingRoutes(app: FastifyInstance) {
  app.get("/api/booking/professionals", async () => {
    return bookingService.listActiveProfessionals();
  });

  app.get(
    "/api/booking/professionals/:id/services",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const id = Number((request.params as { id: string }).id);
      if (Number.isNaN(id)) {
        return reply.status(400).send({ error: "ID inválido", statusCode: 400 });
      }
      return bookingService.listProfessionalServices(id);
    },
  );

  app.get(
    "/api/booking/professionals/:id/slots",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const id = Number((request.params as { id: string }).id);
      if (Number.isNaN(id)) {
        return reply.status(400).send({ error: "ID inválido", statusCode: 400 });
      }
      const query = request.query as { date?: string };
      if (!query.date) {
        return reply.status(400).send({ error: "Parâmetro date é obrigatório", statusCode: 400 });
      }
      return bookingService.getAvailableSlots(id, query.date);
    },
  );

  app.post("/api/booking/appointments", async (request: FastifyRequest, reply: FastifyReply) => {
    const input = createBookingAppointmentSchema.parse(request.body);
    const result = await bookingService.createBooking(input);
    broadcastToProfessional(input.professionalId, "appointment:created", result);
    return reply.status(201).send(result);
  });

  app.get("/api/booking/appointments", async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { phone?: string };
    if (!query.phone) {
      return reply.status(400).send({ error: "Parâmetro phone é obrigatório", statusCode: 400 });
    }
    return bookingService.listClientAppointments(query.phone);
  });

  app.post(
    "/api/booking/appointments/:id/cancel",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const id = Number((request.params as { id: string }).id);
      if (Number.isNaN(id)) {
        return reply.status(400).send({ error: "ID inválido", statusCode: 400 });
      }

      const body = cancelBookingAppointmentSchema.parse(request.body);
      const cancelled = await bookingService.cancelClientAppointment(id, body.phone);
      if (!cancelled) {
        return reply.status(404).send({ error: "Agendamento não encontrado", statusCode: 404 });
      }
      return { ok: true };
    },
  );
}
