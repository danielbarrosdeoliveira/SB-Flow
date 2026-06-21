import type { FastifyReply } from "fastify";

interface SSEClient {
  id: number;
  reply: FastifyReply;
  professionalId: number;
  role: string;
}

let clientIdCounter = 0;
const clients: SSEClient[] = [];

export function addClient(
  reply: FastifyReply,
  professionalId: number,
  role: string,
): SSEClient {
  const client: SSEClient = {
    id: ++clientIdCounter,
    reply,
    professionalId,
    role,
  };
  clients.push(client);
  return client;
}

export function removeClient(id: number) {
  const idx = clients.findIndex((c) => c.id === id);
  if (idx !== -1) clients.splice(idx, 1);
}

function send(client: SSEClient, event: string, data: unknown) {
  try {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    client.reply.raw.write(message);
  } catch {
    removeClient(client.id);
  }
}

export function broadcast(event: string, data: unknown) {
  for (const client of [...clients]) {
    send(client, event, data);
  }
}

export function broadcastToProfessional(
  professionalId: number,
  event: string,
  data: unknown,
) {
  for (const client of [...clients]) {
    if (client.role === "OWNER" || client.professionalId === professionalId) {
      send(client, event, data);
    }
  }
}

export function getClientCount(): number {
  return clients.length;
}
