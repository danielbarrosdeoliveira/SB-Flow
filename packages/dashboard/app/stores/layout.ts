import { useLocalStorage } from "@vueuse/core";

export const useLayoutStore = defineStore("layout", () => {
  const isSidebarOpen = useLocalStorage("sidebar-open", true);

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
  }

  return { isSidebarOpen, toggleSidebar };
});