<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { type VNode, computed } from 'vue';
import type { DynamicLinkProps } from './types';

const props = defineProps<DynamicLinkProps>();

const slots = defineSlots<{ default?: () => VNode }>();

const isExternalLink = computed(() => {
  if (typeof props.to !== 'string') return false;
  return props.to.startsWith('http');
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
