<script setup lang="ts">
import { useToPixel } from '@manatsu/composables/index.ts';
import { type CSSProperties, type ComputedRef, computed, toRef } from 'vue';
import { social } from './svg';
import type { IconProps } from './types';

const props = withDefaults(defineProps<IconProps>(), {
  height: 20,
  width: 20
});

const ariaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel;
  if (typeof props.icon === 'string') return props.icon;

  // eslint-disable-next-line no-undefined
  return undefined;
});

const html = computed<string | null>(() => {
  return typeof props.icon === 'string' ? social[props.icon] : null;
});

const style: ComputedRef<CSSProperties> = useToPixel({
  height: toRef(() => props.height),
  width: toRef(() => props.width)
});
</script>

<template>
  <component
    :is="icon"
    v-if="typeof icon === 'function'"
    :aria-label="ariaLabel"
  />
  <span
    v-else
    class="m-icon"
    :aria-label="ariaLabel"
    :style="style"
    v-html="html"
  ></span>
</template>

<style scoped lang="scss">
.m-icon > :deep(svg) {
  fill: currentColor;
}
</style>
