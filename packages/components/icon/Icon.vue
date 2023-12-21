<script setup lang="ts">
import { computed } from 'vue';
import { socialIcons } from './svg';
import type { IconProps } from './types';

const props = defineProps<IconProps>();

const html = computed<string | null>(() => {
  if (props.svg) return props.svg;
  if (props.icon) return socialIcons[props.icon];
  return null;
});
</script>

<template>
  <span :aria-label="ariaLabel ?? icon" v-html="html"></span>
</template>
