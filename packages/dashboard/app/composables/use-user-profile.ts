import { useQuery } from "@tanstack/vue-query";
import { api } from "~/utils/api";

interface UserProfile {
  id: number;
  name: string;
  phone: string;
  role: "OWNER" | "PARTNER";
  isActive: boolean;
}

export function useUserProfile(userId: MaybeRefOrGetter<number | undefined>) {
  const id = toRef(userId);

  return useQuery({
    queryKey: ["professionals", id],
    queryFn: async (): Promise<UserProfile> => {
      const res = await api.get<UserProfile>(`/api/professionals/${id.value}`);
      return res;
    },
    enabled: computed(() => id.value !== undefined),
  });
}