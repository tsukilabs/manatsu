<script setup lang="ts">
import type { VNode } from 'vue';
import { useToPixel } from '@manatsu/composables/src/index.ts';
import type { IconProps } from './types';

const props = withDefaults(defineProps<IconProps>(), {
  height: '20px',
  width: '20px'
});

defineSlots<{ default: () => VNode }>();

const height = useToPixel(() => props.height);
const width = useToPixel(() => props.width);
</script>

<template>
  <span class="m-icon" :style="style" :aria-label="ariaLabel">
    <component :is="component" v-if="component" />
    <slot v-else></slot>
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
