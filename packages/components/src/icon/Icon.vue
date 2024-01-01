<script setup lang="ts">
import { useToPixel } from '@manatsu/composables/src/index.ts';
import type { IconProps } from './types';

const props = withDefaults(defineProps<IconProps>(), {
  height: '20px',
  width: '20px'
});

const height = useToPixel(() => props.height);
const width = useToPixel(() => props.width);
</script>

<template>
  <span class="m-icon" :style="style" :aria-label="ariaLabel">
    <component :is="icon" />
  </span>
</template>

<style scoped lang="scss">
.m-icon {
  width: v-bind('width');
  height: v-bind('height');
}

.m-icon :deep(svg) {
  fill: currentColor;
}
</style>
