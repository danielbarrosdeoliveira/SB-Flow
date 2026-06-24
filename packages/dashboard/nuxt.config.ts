export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  future: {
    compatibilityVersion: 4,
  },
  modules: ["@pinia/nuxt", "@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  components: [
    { path: "~/components", pathPrefix: false },
    { path: "features/*/components", pathPrefix: false },
  ],
  pinia: {
    storesDirs: ["~/stores/**", "~/features/*/stores/**"],
  },
  imports: {
    dirs: [
      "~/features/*/composables",
    ],
  },
  fonts: {
    families: [
      { name: "Inter", provider: "google" },
      { name: "Playfair Display", provider: "google" },
      { name: "Dancing Script", provider: "google" },
    ],
  },
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || "",
    },
  },
  vite: {
    server: {
      proxy: {
        "/api": {
          target: "http://192.168.31.202:3001",
          changeOrigin: true,
        },
      },
    },
    optimizeDeps: {
      include: [
        '@tanstack/vue-query',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@vueuse/core',
        'zod',
      ]
    }
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

});