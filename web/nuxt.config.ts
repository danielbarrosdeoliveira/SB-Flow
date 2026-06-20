export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  routeRules: {
    "/": { prerender: true },
    "/agendar/**": { ssr: false },
    "/dashboard/**": { ssr: false },
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || "http://localhost:3001",
    },
  },
  app: {
    head: {
      title: "SB-Flow",
      meta: [{ name: "description", content: "Sistema de Gestão para Salões de Beleza" }],
    },
  },
});
