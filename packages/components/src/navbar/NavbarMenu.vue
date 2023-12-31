<script setup lang="ts">
import type { NavbarMenuProps } from './types';
import DynamicLink from '../link/DynamicLink.vue';

defineProps<NavbarMenuProps>();
</script>

<template>
  <div class="m-navbar-menu">
    <template v-for="item of items" :key="item.key">
      <DynamicLink :to="item.to" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.m-navbar-menu {
  display: flex;
}
</style>
