import { useQuery } from "@tanstack/vue-query";
import { api } from "../utils/api";

export interface Client {
  id: number;
  name: string;
  phone: string;
}

export function useClients(searchQuery?: MaybeRefOrGetter<string>) {
  const q = searchQuery != null ? toRef(searchQuery) : ref("");

  return useQuery({
    queryKey: ["clients", q],
    queryFn: async (): Promise<Client[]> => {
      const query = q.value ? `?q=${encodeURIComponent(q.value)}` : "";
      return api.get<Client[]>(`/api/clients${query}`);
    },
  });
}
