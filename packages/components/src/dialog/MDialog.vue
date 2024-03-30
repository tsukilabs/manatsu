<script setup lang="ts">
import { defineEmptyComponent } from '@manatsu/shared';
import { onClickOutside, onKeyStroke, useDraggable } from '@vueuse/core';
import { type StyleValue, type VNode, computed, shallowRef, watch, watchEffect } from 'vue';
import type { DialogProps } from './types';
import { defaultStorage, getInitialPosition, getStorage, ignore } from './utils';

const visible = defineModel<boolean>('visible', { required: true });

const props = withDefaults(defineProps<DialogProps>(), {
  appendTo: 'body',
  closeOnEsc: true,
  draggable: true,
  storageType: defaultStorage
});

const emit = defineEmits<(e: 'hide' | 'show') => void>();

const slots = defineSlots<{
  default?: () => VNode;
  footer?: () => VNode;
  header?: () => VNode;
}>();

const emptyComponent = defineEmptyComponent();

const maskRef = shallowRef<HTMLElement | null>(null);
const dialogRef = shallowRef<HTMLElement | null>(null);
const headerRef = shallowRef<HTMLElement | null>(null);

const dragHandle = computed(() => {
  if (!props.draggable) return null;
  return props.handle ?? headerRef.value ?? dialogRef.value;
});

const { position, style: draggableStyle } = useDraggable(dialogRef, {
  containerElement: maskRef,
  handle: dragHandle,
  disabled: computed(() => !props.draggable),
  initialValue: getInitialPosition(props)
});

const draggableComputedStyle = computed<StyleValue>(() => {
  return props.draggable ? [draggableStyle.value, { position: 'fixed' }] : null;
});

const hasHeader = computed(() => {
  return Boolean(slots.header ?? props.header);
});

onClickOutside(
  dialogRef,
  () => {
    if (props.closeOnClickOutside) {
      visible.value &&= false;
    }
  },
  { ignore }
);

onKeyStroke('Escape', (e) => {
  if (props.closeOnEsc && visible.value) {
    e.preventDefault();
    visible.value = false;
  }
});

watch(visible, (value) => {
  if (value) {
    emit('show');
  } else {
    emit('hide');
  }
});

watchEffect(() => {
  if (visible.value && props.storageKey) {
    const storage = getStorage(props.storageType);
    const dimensions = JSON.stringify({ x: position.value.x, y: position.value.y });
    storage.setItem(props.storageKey, dimensions);
  }
});
</script>

<template>
  <teleport :to="appendTo">
    <div v-if="visible" ref="maskRef" class="m-dialog-mask" :class="{ 'm-dialog-backdrop': modal }">
      <div :style="draggableComputedStyle">
        <div ref="dialogRef" class="m-dialog" :class="dialogClass" :style="dialogStyle">
          <div
            v-if="hasHeader"
            ref="headerRef"
            class="m-dialog-header"
            :class="headerClass"
            :style="headerStyle"
          >
            <slot v-if="$slots.header" name="header"></slot>
            <span v-else>{{ header }}</span>
          </div>
          <div class="m-dialog-content" :class="contentClass" :style="contentStyle">
            <slot></slot>
          </div>
          <div
            v-if="$slots.footer"
            class="m-dialog-footer"
            :class="footerClass"
            :style="footerStyle"
          >
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
    <empty-component v-else />
  </teleport>
</template>

<style lang="scss">
@use '@manatsu/style/mixins/flex';

:root {
  --m-dialog-z-index: 1000;
}

.m-dialog-mask {
  @include flex.center;
  position: fixed;
  z-index: var(--m-dialog-z-index);
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: v-bind("modal ? 'auto' : 'none'");
}

.m-dialog-backdrop {
  background-color: rgb(0 0 0 / 40%);
}

.m-dialog {
  @include flex.center;
  flex-direction: column;
  box-shadow:
    0 1px 2px 0 rgb(0 0 0 / 30%),
    0 1px 3px 1px rgb(0 0 0 / 15%);
  border-radius: 6px;
  background-color: var(--m-color-surface-container-high);
  pointer-events: auto;

  &-header {
    @include flex.x-start-y-center;
    padding: 1rem;
    width: 100%;
    font-size: 1.25rem;
  }

  &-content {
    padding: 1rem;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  &-footer {
    @include flex.center;
    padding: 1rem;
    width: 100%;
  }
}
</style>
