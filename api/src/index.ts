import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import Fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./lib/env.js";
import { jwtPlugin } from "./lib/plugins/auth.js";
import { authRoutes } from "./modules/auth/routes.js";
import { partnerRoutes } from "./modules/partner/routes.js";

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "development" ? "debug" : "info",
  },
});

await app.register(cors, {
  origin: env.WEB_URL,
  credentials: true,
});

await app.register(cookie, {
  secret: env.JWT_SECRET,
});

await jwtPlugin(app);

app.setErrorHandler((error: Error & { statusCode?: number }, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: "Dados inválidos",
      details: error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })),
      statusCode: 400,
    });
  }
  app.log.error(error);
  const statusCode = error.statusCode ?? 500;
  reply.status(statusCode).send({
    error: statusCode >= 500 ? "Internal server error" : error.message,
    statusCode,
  });
});

app.get("/api/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

await app.register(authRoutes);
await app.register(partnerRoutes);

try {
  await app.listen({ port: env.API_PORT, host: "0.0.0.0" });
  app.log.info(`Server listening on port ${env.API_PORT}`);
} catch (err) {
  app.log.fatal(err);
  process.exit(1);
}

export default app;
