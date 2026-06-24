<template>
  <div>
    <div class="p-6 text-foreground">Serviços - Em construção</div>
  </div>
</template>

<script setup lang="ts">
import authMiddleware from "~/features/auth/middleware/auth";

definePageMeta({
  layout: "dashboard",
  middleware: authMiddleware,
});
</script>