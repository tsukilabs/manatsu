<script setup lang="ts">
import type { VNode } from 'vue';
import { RouterLink } from 'vue-router';
import { useExternalLink } from '@manatsu/composables/src/index.ts';
import type { DynamicLinkProps } from './types';

const props = defineProps<DynamicLinkProps>();

defineOptions({ name: 'MDynamicLink' });

defineSlots<{ default: () => VNode }>();

const isExternalLink = useExternalLink(() => props.to);
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
