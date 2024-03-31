<script setup lang="ts">
import type { VNode } from 'vue';
import type { EllipsisProps } from './types';

defineProps<EllipsisProps>();

defineSlots<{ default?: () => VNode }>();
</script>

<template>
  <span class="m-ellipsis">
    <slot>{{ text }}</slot>
  </span>
</template>

<style lang="scss">
.m-ellipsis {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
