import { useQuery } from "@tanstack/vue-query";
import { api } from "~/shared/utils/api";

export interface Treatment {
  id: number;
  professionalId: number;
  name: string;
  durationMinutes: number;
  price: string;
  description: string | null;
  isActive: boolean;
}

export function useTreatments(professionalId?: MaybeRefOrGetter<number | undefined>) {
  const pid = professionalId != null ? toRef(professionalId) : ref(undefined);

  return useQuery({
    queryKey: ["treatments", pid],
    queryFn: async (): Promise<Treatment[]> => {
      const query = pid.value !== undefined ? `?professional_id=${pid.value}` : "";
      return api.get<Treatment[]>(`/api/services${query}`);
    },
  });
}