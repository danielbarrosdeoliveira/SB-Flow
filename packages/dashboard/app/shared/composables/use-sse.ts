import { useQueryClient } from "@tanstack/vue-query";

const EVENT_QUERY_MAP: Record<string, string[]> = {
  "appointment:created": ["appointments"],
  "appointment:updated": ["appointments"],
  "appointment:cancelled": ["appointments"],
  "appointment:status-changed": ["appointments"],
  "block:created": ["blocks"],
  "block:deleted": ["blocks"],
};

export function useSSE() {
  const queryClient = useQueryClient();
  let eventSource: EventSource | null = null;

  function connect() {
    if (eventSource?.readyState === EventSource.OPEN) return;

    const apiUrl = import.meta.env.NUXT_PUBLIC_API_URL ?? "";

    eventSource = new EventSource(`${apiUrl}/api/sse`, {
      withCredentials: true,
    });

    eventSource.onopen = () => {
    };

    for (const [event, queryKeys] of Object.entries(EVENT_QUERY_MAP)) {
      eventSource.addEventListener(event, (e: MessageEvent) => {
        for (const key of queryKeys) {
          queryClient.invalidateQueries({ queryKey: [key] });
        }
      });
    }

    eventSource.onerror = () => {
      eventSource?.close();
      setTimeout(() => connect(), 5000);
    };
  }

  function disconnect() {
    eventSource?.close();
    eventSource = null;
  }

  return { connect, disconnect };
}