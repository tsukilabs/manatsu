<script setup lang="ts">
import type { NavbarProps } from './types';

withDefaults(defineProps<NavbarProps>(), {
  height: '30px'
});
</script>

<template>
  <div class="m-navbar" :style="style"></div>
</template>

<style scoped lang="scss">
.m-navbar {
  display: flex;
  width: 100%;
  height: v-bind('height');
}
</style>
