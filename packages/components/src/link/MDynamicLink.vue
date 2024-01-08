<script setup lang="ts">
import type { VNode } from 'vue';
import { type RouteLocationRaw, RouterLink } from 'vue-router';
import { useExternalLink } from '@manatsu/composables/src/index.ts';

const slots = defineSlots<{ default?: () => VNode }>();

const to = defineModel<RouteLocationRaw>('to');
const isExternalLink = useExternalLink(to);

defineExpose({ isExternalLink });
</script>

<template>
  <template v-if="to">
    <a
      v-if="typeof to === 'string' && isExternalLink"
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

  <span v-else>
    <slot></slot>
  </span>
</template>
