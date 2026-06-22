<template>
  <div class="tw-scope page-landing min-h-screen bg-sb-white text-sb-dark overflow-x-hidden">
    <LNavbar />
    <slot />
    <LFooter />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>
