<template>
  <span class="m-select-trigger">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
      <path
        d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"
      ></path>
    </svg>
  </span>
</template>

<style lang="scss">
@use '@manatsu/style/mixins/flex';

.m-select-trigger {
  @include flex.center;
  width: 2.5rem;

  & > svg {
    fill: currentColor;
    width: 1rem;
    height: 1rem;
  }
}
</style>
