<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { DynamicLinkProps } from './types';

const props = defineProps<DynamicLinkProps>();

const isExternalLink = computed(() => {
  if (typeof props.to === 'string') {
    return props.to.startsWith('http');
  }

  return false;
});
</script>

<template>
  <span v-if="!to">
    <slot></slot>
  </span>

  <!-- prettier-ignore -->
  <a
    v-else-if="isExternalLink"
    :href="(to as string)"
    target="_blank"
    rel="noopener noreferrer"
  >
    <slot></slot>
  </a>

  <RouterLink v-else :to="to">
    <slot></slot>
  </RouterLink>
</template>
