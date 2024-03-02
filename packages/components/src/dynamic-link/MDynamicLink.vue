<script setup lang="ts">
import { type VNode, computed } from 'vue';
import { type RouteLocationRaw, RouterLink } from 'vue-router';

const to = defineModel<RouteLocationRaw>('to');

const slots = defineSlots<{ default?: () => VNode }>();

const isExternalLink = computed(() => {
  if (typeof to.value !== 'string') return false;
  return to.value.startsWith('http');
});

defineExpose({ isExternalLink });
</script>

<template>
  <span v-if="!to">
    <slot></slot>
  </span>

  <a
    v-else-if="typeof to === 'string' && isExternalLink"
    :href="to"
    target="_blank"
    rel="noopener noreferrer"
  >
    <slot></slot>
  </a>

  <RouterLink v-else :to="to">
    <slot></slot>
  </RouterLink>
</template>
