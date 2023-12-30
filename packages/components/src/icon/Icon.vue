<script setup lang="ts">
import { useToPixel } from '@manatsu/composables/src/index.ts';
import { type CSSProperties, type ComputedRef, toRef } from 'vue';
import type { IconProps } from './types';

const props = withDefaults(defineProps<IconProps>(), {
  height: 20,
  width: 20
});

const style: ComputedRef<CSSProperties> = useToPixel({
  height: toRef(() => props.height),
  width: toRef(() => props.width)
});
</script>

<template>
  <span class="m-icon" :style="style" :aria-label="ariaLabel">
    <component :is="icon" />
  </span>
</template>

<style scoped lang="scss">
.m-icon :deep(svg) {
  fill: currentColor;
}
</style>
