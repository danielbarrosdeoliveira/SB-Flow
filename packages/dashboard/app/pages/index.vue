<script setup lang="ts">
import { useAuthStore } from "~/features/auth/stores/auth";

const auth = useAuthStore();

if (!auth.isAuthenticated) {
  await navigateTo("/login");
} else {
  await navigateTo("/dashboard/");
}
</script>

<template>
  <div />
</template>