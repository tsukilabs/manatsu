<script setup lang="ts">
import { onClickOutside, onKeyStroke, useDraggable } from '@vueuse/core';
import { type VNode, computed, shallowRef, watch, watchEffect } from 'vue';
import type { DialogProps } from './types';

const visible = defineModel<boolean>('visible', { required: true });

const props = withDefaults(defineProps<DialogProps>(), {
  appendTo: 'body',
  draggable: true,
  esc: true,
  storageType: 'session'
});

const emit = defineEmits<{
  (e: 'hide'): void;
  (e: 'show'): void;
}>();

const slots = defineSlots<{
  default?: () => VNode;
  footer?: () => VNode;
  header?: () => VNode;
}>();

const maskRef = shallowRef<HTMLElement | null>(null);
const dialogRef = shallowRef<HTMLElement | null>(null);
const headerRef = shallowRef<HTMLElement | null>(null);

const { position, style: draggableStyle } = useDraggable(dialogRef, {
  containerElement: maskRef,
  handle: computed(() => props.handle ?? headerRef.value ?? dialogRef.value),
  disabled: computed(() => !props.draggable),
  initialValue: getInitialPosition()
});

const dialogComputedStyle = computed(() => {
  const styles = [props.dialogStyle].filter(Boolean);
  if (props.draggable) {
    styles.push(draggableStyle.value, { position: 'fixed' });
  }

  return styles;
});

const hasHeader = computed(() => {
  return Boolean(slots.header ?? props.header);
});

onClickOutside(dialogRef, () => {
  if (props.clickOutside) {
    visible.value = false;
  }
});

onKeyStroke('Escape', (e) => {
  if (props.esc && visible.value) {
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
    const storage = getStorage();
    storage.setItem(props.storageKey, JSON.stringify({ x: position.value.x, y: position.value.y }));
  }
});

function getInitialPosition() {
  if (typeof props.storageKey !== 'string') {
    return getDefaultPosition();
  }

  const storage = getStorage();
  const previousPosition = storage.getItem(props.storageKey);
  if (!previousPosition) return getDefaultPosition();

  try {
    const parsed = JSON.parse(previousPosition) as { x: string; y: string };
    const x = Number.parseFloat(parsed.x);
    const y = Number.parseFloat(parsed.y);

    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return getDefaultPosition();
    }

    return { x, y };
  } catch {
    return getDefaultPosition();
  }
}

function getDefaultPosition() {
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

function getStorage() {
  return props.storageType === 'session' ? sessionStorage : localStorage;
}
</script>

<template>
  <teleport :to="appendTo">
    <div v-if="visible" ref="maskRef" class="m-dialog-mask" :class="{ 'm-dialog-backdrop': modal }">
      <div ref="dialogRef" class="m-dialog" :class="dialogClass" :style="dialogComputedStyle">
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
        <div v-if="$slots.footer" class="m-dialog-footer" :class="footerClass" :style="footerStyle">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss">
@use '@manatsu/sass/flex';

.m-dialog-mask {
  @include flex.center;
  position: fixed;
  z-index: 9000;
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
