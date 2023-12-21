<script setup lang="ts">
import { defineComponent, h } from 'vue';
import type { NavbarLogoProps } from './types';

const props = defineProps<NavbarLogoProps>();

const TitleLogo = defineComponent(() => {
  if (typeof props.logo === 'function') {
    return props.logo;
  }

  return () =>
    h('img', {
      src: props.logo
    });
});
</script>

<template>
  <TitleLogo class="m-navbar-logo" />
</template>

<style scoped lang="scss">
:global(:root) {
  --m-navbar-logo-margin: 0 8px 0 0;
}

.m-navbar-logo {
  margin: var(--m-navbar-logo-margin);
}
</style>
