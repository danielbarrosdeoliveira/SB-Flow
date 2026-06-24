import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { db } from "../../db/index.js";
import { professionals } from "../../db/schema/professionals.js";
import { env } from "../../lib/env.js";
import { normalizePhone } from "../../lib/phone.js";
import type { LoginInput } from "./schema.js";

interface JwtPayload {
  professionalId: number;
  role: string;
}

function parseDuration(s: string): number {
  const match = s.match(/^(\d+)([smhd])$/);
  if (!match) return 900;
  const n = Number(match[1]);
  switch (match[2]) {
    case "s":
      return n;
    case "m":
      return n * 60;
    case "h":
      return n * 3600;
    case "d":
      return n * 86400;
    default:
      return 900;
  }
}

export async function login(input: LoginInput) {
  const phone = normalizePhone(input.phone);

  const [professional] = await db
    .select({
      id: professionals.id,
      name: professionals.name,
      phone: professionals.phone,
      cpf: professionals.cpf,
      passwordHash: professionals.passwordHash,
      role: professionals.role,
      isActive: professionals.isActive,
    })
    .from(professionals)
    .where(eq(professionals.phone, phone))
    .limit(1);

  if (!professional || !professional.isActive) {
    throw new AuthError("Credenciais inválidas");
  }

  const valid = await bcrypt.compare(input.password, professional.passwordHash);
  if (!valid) {
    throw new AuthError("Credenciais inválidas");
  }

  const payload: JwtPayload = {
    professionalId: professional.id,
    role: professional.role,
  };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: parseDuration(env.JWT_EXPIRES_IN),
  });
  const refreshToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: parseDuration(env.JWT_REFRESH_EXPIRES_IN),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: professional.id,
      name: professional.name,
      phone: professional.phone,
      role: professional.role,
    },
  };
}

export async function refresh(token: string) {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const [professional] = await db
      .select({
        id: professionals.id,
        name: professionals.name,
        phone: professionals.phone,
        role: professionals.role,
        isActive: professionals.isActive,
      })
      .from(professionals)
      .where(eq(professionals.id, payload.professionalId))
      .limit(1);

    if (!professional || !professional.isActive) {
      throw new AuthError("Sessão expirada");
    }

    const newPayload: JwtPayload = {
      professionalId: professional.id,
      role: professional.role,
    };

    const accessToken = jwt.sign(newPayload, env.JWT_SECRET, {
      expiresIn: parseDuration(env.JWT_EXPIRES_IN),
    });
    const newRefreshToken = jwt.sign(newPayload, env.JWT_SECRET, {
      expiresIn: parseDuration(env.JWT_REFRESH_EXPIRES_IN),
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: professional.id,
        name: professional.name,
        phone: professional.phone,
        role: professional.role,
      },
    };
  } catch {
    throw new AuthError("Sessão expirada");
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
