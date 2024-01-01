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
.m-navbar-title {
  font-weight: 600;
  font-size: 1.5rem;
}
</style>
