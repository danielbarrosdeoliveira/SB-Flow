import { QueryClient, VueQueryPlugin, dehydrate, hydrate } from "@tanstack/vue-query";
import type { DehydratedState } from "@tanstack/vue-query";

export default defineNuxtPlugin({
  name: "vue-query",
  setup: (nuxtApp) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 2,
          gcTime: 1000 * 60 * 5,
          retry: false,
          refetchOnWindowFocus: false,
        },
      },
    });

    nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

    if (import.meta.server) {
      nuxtApp.hooks.hook("app:rendered", () => {
        nuxtApp.payload.vueQuery = dehydrate(queryClient);
      });
    }

    if (import.meta.client) {
      nuxtApp.hooks.hook("app:created", () => {
        const state = nuxtApp.payload.vueQuery as DehydratedState | undefined;
        if (state) {
          hydrate(queryClient, state);
        }
      });
    }

    return { provide: { queryClient } };
  },
});
