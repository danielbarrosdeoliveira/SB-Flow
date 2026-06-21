<template>
  <div class="page-landing min-h-screen bg-sb-white text-sb-dark overflow-x-hidden">
    <LNavbar />
    <slot />
    <LFooter />
  </div>
</template>

<style>
.page-landing {
  box-sizing: border-box;
}

.page-landing *,
.page-landing *::before,
.page-landing *::after {
  box-sizing: border-box;
}

.page-landing html,
.page-landing body,
.page-landing div,
.page-landing span,
.page-landing h1,
.page-landing h2,
.page-landing h3,
.page-landing h4,
.page-landing h5,
.page-landing h6,
.page-landing p,
.page-landing blockquote,
.page-landing figure,
.page-landing figcaption,
.page-landing dl,
.page-landing dd,
.page-landing ol,
.page-landing ul,
.page-landing li,
.page-landing fieldset,
.page-landing form,
.page-landing label,
.page-landing legend,
.page-landing table,
.page-landing caption,
.page-landing tbody,
.page-landing tfoot,
.page-landing thead,
.page-landing tr,
.page-landing th,
.page-landing td {
  margin: 0;
  padding: 0;
}

.page-landing h1,
.page-landing h2,
.page-landing h3,
.page-landing h4,
.page-landing h5,
.page-landing h6 {
  font-size: inherit;
  font-weight: inherit;
}

.page-landing a {
  color: inherit;
  text-decoration: none;
}

.page-landing img,
.page-landing picture,
.page-landing video,
.page-landing canvas,
.page-landing svg {
  display: block;
  max-width: 100%;
}

.page-landing button,
.page-landing input,
.page-landing select,
.page-landing textarea {
  font: inherit;
  color: inherit;
}

.page-landing button {
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

.page-landing ol,
.page-landing ul {
  list-style: none;
}

html {
  scroll-behavior: smooth;
}
</style>
