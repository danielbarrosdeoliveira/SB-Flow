import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { api } from "~/utils/api";

export interface Service {
  id: number;
  professionalId: number;
  name: string;
  durationMinutes: number | null;
  price: string | null;
  description: string | null;
  isActive: boolean;
  category: string | null;
  procedureType: string | null;
  parentId: number | null;
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async (): Promise<Service[]> => {
      return api.get<Service[]>("/api/services");
    },
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      professionalId: number;
      name: string;
      durationMinutes?: number;
      price?: number;
      description?: string;
      category?: string;
      procedureType?: string;
      parentId?: number;
    }) => {
      return api.post<Service>("/api/services", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<{
        name: string;
        durationMinutes: number | null;
        price: number | null;
        description: string | null;
        isActive: boolean;
        category: string | null;
        procedureType: string | null;
        parentId: number | null;
      }>;
    }) => {
      return api.put<Service>(`/api/services/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/api/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
