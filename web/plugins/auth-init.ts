export default defineNuxtPlugin({
  name: "auth-init",
  setup: async () => {
    const auth = useAuthStore();
    try {
      await auth.refreshToken();
    } catch {
      // Not authenticated — ok
    }
  },
});
