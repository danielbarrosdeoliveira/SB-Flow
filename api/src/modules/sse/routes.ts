import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { requireAuth } from "../../lib/plugins/auth.js";
import { addClient, removeClient } from "../../lib/sse-manager.js";

export async function sseRoutes(app: FastifyInstance) {
  app.get(
    "/api/sse",
    { preHandler: [requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user!;

      reply.raw.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      });

      const client = addClient(reply, user.professionalId, user.role);

      // Send initial connection event
      reply.raw.write(`event: connected\ndata: ${JSON.stringify({ ok: true })}\n\n`);

      // Heartbeat every 30s to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          reply.raw.write(": heartbeat\n\n");
        } catch {
          clearInterval(heartbeat);
          removeClient(client.id);
        }
      }, 30000);

      // Clean up on disconnect
      request.raw.on("close", () => {
        clearInterval(heartbeat);
        removeClient(client.id);
      });
    },
  );
}
