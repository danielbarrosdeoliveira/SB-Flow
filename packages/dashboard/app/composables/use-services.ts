import { useQuery } from "@tanstack/vue-query";
import { api } from "../utils/api";

export interface Service {
  id: number;
  professionalId: number;
  name: string;
  durationMinutes: number;
  price: string;
  description: string | null;
  isActive: boolean;
}

export function useServices(professionalId?: MaybeRefOrGetter<number | undefined>) {
  const pid = professionalId != null ? toRef(professionalId) : ref(undefined);

  return useQuery({
    queryKey: ["services", pid],
    queryFn: async (): Promise<Service[]> => {
      const query = pid.value !== undefined ? `?professional_id=${pid.value}` : "";
      return api.get<Service[]>(`/api/services${query}`);
    },
  });
}
