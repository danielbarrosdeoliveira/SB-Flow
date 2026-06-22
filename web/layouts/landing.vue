<template>
  <div class="page-landing min-h-screen bg-sb-white text-sb-dark overflow-x-hidden">
    <LNavbar />
    <slot />
    <LFooter />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}

:where(.page-landing) {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  tab-size: 4;
}

:where(.page-landing) *,
:where(.page-landing) *::before,
:where(.page-landing) *::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: currentColor;
  margin: 0;
  padding: 0;
}

:where(.page-landing) h1,
:where(.page-landing) h2,
:where(.page-landing) h3,
:where(.page-landing) h4,
:where(.page-landing) h5,
:where(.page-landing) h6 {
  font-weight: inherit;
}

:where(.page-landing) a {
  color: inherit;
  text-decoration: none;
}

:where(.page-landing) img,
:where(.page-landing) picture,
:where(.page-landing) video,
:where(.page-landing) canvas,
:where(.page-landing) svg {
  display: block;
  max-width: 100%;
  height: auto;
}

:where(.page-landing) button,
:where(.page-landing) input,
:where(.page-landing) select,
:where(.page-landing) textarea {
  font: inherit;
  color: inherit;
}

:where(.page-landing) button {
  cursor: pointer;
}

:where(.page-landing) ol,
:where(.page-landing) ul {
  list-style: none;
}
</style>
