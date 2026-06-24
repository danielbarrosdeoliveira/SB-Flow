import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { api } from "~/utils/api";

export interface Professional {
  id: number;
  name: string;
  phone: string;
  cpf: string;
  role: "OWNER" | "PARTNER";
  isActive: boolean;
  workHoursStart: string;
  workHoursEnd: string;
  createdAt: string;
  updatedAt: string;
}

export function useProfessionals() {
  return useQuery({
    queryKey: ["professionals"],
    queryFn: async (): Promise<Professional[]> => {
      return api.get<Professional[]>("/api/professionals");
    },
  });
}

export function useCreateProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      cpf: string;
      password: string;
      workHoursStart?: string;
      workHoursEnd?: string;
    }) => {
      return api.post<Professional>("/api/professionals", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}

export function useUpdateProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<{
        name: string;
        phone: string;
        password: string;
        workHoursStart: string;
        workHoursEnd: string;
      }>;
    }) => {
      return api.put<Professional>(`/api/professionals/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}

export function useToggleProfessionalActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return api.patch<Professional>(`/api/professionals/${id}/toggle-active`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}
