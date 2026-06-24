import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { api } from "~/utils/api";

export interface Client {
  id: number;
  name: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
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

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; phone: string }) => {
      return api.post<Client>("/api/clients", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<{ name: string; phone: string }> }) => {
      return api.put<Client>(`/api/clients/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
