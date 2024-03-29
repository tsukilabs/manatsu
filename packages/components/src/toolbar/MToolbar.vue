<script setup lang="ts">
import { type VNode, computed, shallowRef } from 'vue';
import { useElementSize } from '@manatsu/composables/src/index.ts';
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
  return ['m-toolbar', props.border && 'm-toolbar-border'];
});

const startRef = shallowRef<HTMLElement | null>(null);
const { width: startWidth } = useElementSize(startRef);

const centerRef = shallowRef<HTMLElement | null>(null);
const { width: centerWidth } = useElementSize(centerRef);

const endRef = shallowRef<HTMLElement | null>(null);
const { width: endWidth } = useElementSize(endRef);

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
@use '@manatsu/style/mixins/flex';

.m-toolbar {
  @include flex.x-between-y-center;
  gap: 1rem;
  padding: 0.75rem;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;

  &-start {
    @include flex.x-start-y-center;
    width: 100%;
  }

  &-center {
    @include flex.center;
    width: 100%;
  }

  &-end {
    @include flex.x-end-y-center;
    width: 100%;
  }

  &-border {
    border: 1px solid var(--m-color-outline-variant);
    border-radius: var(--m-border-radius);
  }
}
</style>
