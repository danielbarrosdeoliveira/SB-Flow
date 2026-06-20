import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import Fastify from "fastify";
import { env } from "./lib/env.js";

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

app.setErrorHandler((error: Error & { statusCode?: number }, _request, reply) => {
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

try {
  await app.listen({ port: env.API_PORT, host: "0.0.0.0" });
  app.log.info(`Server listening on port ${env.API_PORT}`);
} catch (err) {
  app.log.fatal(err);
  process.exit(1);
}

export default app;
