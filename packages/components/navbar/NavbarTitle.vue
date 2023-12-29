<script setup lang="ts">
import type { NavbarTitleProps } from './types';

defineProps<NavbarTitleProps>();
</script>

<template>
  <component
    :is="title"
    v-if="typeof title === 'function'"
    class="m-navbar-title"
  />

  <span v-else class="m-navbar-title">{{ title }}</span>
</template>

<style scoped lang="scss">
:global(:root) {
  --m-navbar-title-font-size: 1.5rem;
  --m-navbar-title-font-weight: 600;
}

.m-navbar-title {
  font-weight: var(--m-navbar-title-font-weight);
  font-size: var(--m-navbar-title-font-size);
}
</style>
