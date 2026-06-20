import { useQuery } from "@tanstack/vue-query";
import { api } from "../utils/api";

export interface Appointment {
  id: number;
  professionalId: number;
  clientId: number;
  serviceId: number;
  startTime: string;
  endTime: string;
  status: string;
  clientName: string;
  serviceName: string;
}

export function useAppointments(date: MaybeRefOrGetter<string>) {
  const d = toRef(date);

  return useQuery({
    queryKey: ["appointments", d],
    queryFn: async (): Promise<Appointment[]> => {
      const res = await api.get<Appointment[]>(
        `/api/appointments?date=${d.value}`,
      );
      return res;
    },
  });
}

export function useAppointmentsByProfessional(
  date: MaybeRefOrGetter<string>,
  professionalId: MaybeRefOrGetter<number | undefined>,
) {
  const d = toRef(date);
  const pid = toRef(professionalId);

  return useQuery({
    queryKey: ["appointments", d, pid],
    queryFn: async (): Promise<Appointment[]> => {
      const res = await api.get<Appointment[]>(
        `/api/appointments?date=${d.value}&professional_id=${pid.value}`,
      );
      return res;
    },
    enabled: computed(() => pid.value !== undefined),
  });
}
