import type { Config } from "tailwindcss"

export default (<Config>{
  content: ["./app/components/**/*.{vue,js,ts}", "./app/layouts/**/*.vue", "./app/pages/**/*.vue", "./app/app.vue"],
  theme: {
    extend: {
      colors: {
        "sb-white": "var(--color-bg)",
        "sb-dark": "var(--color-foreground)",
        "sb-primary": "var(--color-primary)",
        "sb-primary-light": "var(--color-primary-light)",
        "sb-primary-dark": "var(--color-primary-dark)",
        "sb-warm": "var(--color-warm)",
        "sb-sand": "var(--color-sand)",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        cursive: ["Dancing Script", "cursive"],
      },
    },
  },
})
