function getApiUrl(): string {
  if (import.meta.server) {
    return process.env.NUXT_PUBLIC_API_URL ?? "http://localhost:3001";
  }
  return "http://localhost:3001";
}

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiUrl();
  const body = options.body;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };
  if (body) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${baseUrl}${path}`, {
    credentials: "include",
    headers,
    method: options.method,
    body,
  });

  if (res.status === 401) {
    const refreshRes = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const retryRes = await fetch(`${baseUrl}${path}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });
      if (!retryRes.ok) {
        const retryErr = await retryRes.json().catch(() => ({ error: "Request failed" }));
        throw new ApiError(retryErr.error ?? "Request failed", retryRes.status);
      }
      return retryRes.json();
    }

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiError("Não autenticado", 401);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new ApiError(err.error ?? "Request failed", res.status);
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
