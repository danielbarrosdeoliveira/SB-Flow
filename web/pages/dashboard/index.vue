<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

await navigateTo("/dashboard/agenda", { replace: true });
</script>
