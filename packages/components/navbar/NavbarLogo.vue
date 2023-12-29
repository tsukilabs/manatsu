<script setup lang="ts">
import type { NavbarLogoProps } from './types';

defineProps<NavbarLogoProps>();
</script>

<template>
  <component
    :is="logo"
    v-if="typeof logo === 'function'"
    class="m-navbar-logo"
  />

  <img v-else class="m-navbar-logo" />
</template>

<style scoped lang="scss">
:global(:root) {
  --m-navbar-logo-margin: 0 8px 0 0;
}

.m-navbar-logo {
  margin: var(--m-navbar-logo-margin);
}
</style>
