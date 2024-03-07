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
  <a
    v-if="typeof to === 'string' && isExternalLink"
    :href="to"
    target="_blank"
    rel="noopener noreferrer"
  >
    <slot></slot>
  </a>

  <component :is="to ? RouterLink : 'span'" v-else :to>
    <slot></slot>
  </component>
</template>
