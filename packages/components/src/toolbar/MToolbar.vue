<script setup lang="ts">
import { type VNode, computed, shallowRef } from 'vue';
import { usePixelWidth } from '@manatsu/composables/src/index.ts';
import type { ToolbarProps } from './types';

const props = withDefaults(defineProps<ToolbarProps>(), {
  border: true,
  tag: 'div'
});

const slots = defineSlots<{
  center?: () => VNode;
  end?: () => VNode;
  start?: () => VNode;
}>();

const classList = computed(() => {
  const classes = ['m-toolbar'];
  if (props.border) classes.push('m-toolbar-border');
  return classes;
});

const startRef = shallowRef<HTMLElement | null>(null);
const startWidth = usePixelWidth(startRef);

const centerRef = shallowRef<HTMLElement | null>(null);
const centerWidth = usePixelWidth(centerRef);

const endRef = shallowRef<HTMLElement | null>(null);
const endWidth = usePixelWidth(endRef);

defineExpose({ startWidth, centerWidth, endWidth });
</script>

<template>
  <component :is="tag" :class="classList">
    <div
      v-if="$slots.start"
      ref="startRef"
      class="m-toolbar-start"
      :class="startClass"
      :style="startStyle"
    >
      <slot name="start"></slot>
    </div>
    <div
      v-if="$slots.center"
      ref="centerRef"
      class="m-toolbar-center"
      :class="centerClass"
      :style="centerStyle"
    >
      <slot name="center"></slot>
    </div>
    <div v-if="$slots.end" ref="endRef" class="m-toolbar-end" :class="endClass" :style="endStyle">
      <slot name="end"></slot>
    </div>
  </component>
</template>

<style lang="scss">
@use '@manatsu/sass/flex';

.m-toolbar {
  @include flex.x-between-y-center;
  gap: 1rem;
  padding: 0.75rem;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;

  &-start {
    @include flex.x-start-y-center;
  }

  &-center {
    @include flex.center;
  }

  &-end {
    @include flex.x-end-y-center;
  }

  &-border {
    border: 1px solid var(--m-color-outline-variant);
    border-radius: var(--m-border-radius);
  }
}
</style>
