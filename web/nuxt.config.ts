export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss", "vuetify-nuxt-module", "nuxt-icon"],
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
  },
  css: ["~/assets/css/tokens.css"],
  components: [
    { path: "~/components", pathPrefix: false },
  ],
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
      title: "Studio Blessed — Beleza e Cuidados Femininos em Barueri",
      meta: [
        {
          name: "description",
          content:
            "Studio Blessed — Extensão de Cílios, Lash Lifting, Sobrancelha, Hidra Gloss, Epilação, Limpeza de Pele e mais. Agende seu horário em Barueri-SP.",
        },
        {
          name: "keywords",
          content:
            "salão de beleza, Studio Blessed, extensão de cílios, lash lifting, sobrancelha, Barueri",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon/favicon-16x16.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap",
        },
      ],
    },
  },
  vuetify: {
    moduleOptions: {},
    vuetifyOptions: {
      theme: {
        defaultTheme: "light",
        themes: {
          light: {
            colors: {
              primary: "#A78B58",
              secondary: "#4F4B40",
              accent: "#D9C49E",
            },
          },
        },
      },
    },
  },
});
