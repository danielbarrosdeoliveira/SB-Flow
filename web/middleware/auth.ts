export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith("/dashboard")) return;

  const auth = useAuthStore();

  if (!auth.isAuthenticated) {
    const refreshed = await auth.refreshToken();
    if (!refreshed) {
      return navigateTo("/login");
    }
  }
});
