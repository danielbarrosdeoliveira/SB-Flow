export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ["@pinia/nuxt", "vuetify-nuxt-module"],
  components: [
    { path: "~/components", pathPrefix: false },
  ],
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || "http://localhost:3001",
    },
  },
  app: {
    head: {
      title: "Studio Blessed — Dashboard",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon/favicon-16x16.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png" },
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
})
