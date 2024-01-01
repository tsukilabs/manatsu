<script setup lang="ts">
import type { NavbarMenuProps } from './types';
import DynamicLink from '../link/DynamicLink.vue';

defineProps<NavbarMenuProps>();
</script>

<template>
  <div class="m-navbar-menu">
    <div
      v-for="item of items"
      :key="item.key"
      class="m-navbar-menu-item"
      role="none"
    >
      <DynamicLink :to="item.to">
        <component :is="item.label" v-if="typeof item.label === 'function'" />
        <span v-else>{{ item.label ?? item.key }}</span>
      </DynamicLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@manatsu/sass/flex';

.m-navbar-menu {
  @include flex.y-center;
}
</style>
