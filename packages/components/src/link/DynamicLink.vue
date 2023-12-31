<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useExternalLink } from '@manatsu/composables/src/index.ts';
import type { DynamicLinkProps } from './types';

const props = defineProps<DynamicLinkProps>();

const isExternalLink = useExternalLink(() => props.to);
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
