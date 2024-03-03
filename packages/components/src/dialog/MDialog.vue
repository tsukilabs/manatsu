<script setup lang="ts">
import { type VNode, computed, shallowRef, watchEffect } from 'vue';
import { onClickOutside, onKeyStroke, useDraggable } from '@vueuse/core';
import type { DialogProps } from './types';

const visible = defineModel<boolean>('visible', { required: true });

const props = withDefaults(defineProps<DialogProps>(), {
  appendTo: 'body',
  draggable: true,
  positionStorageType: 'session'
});

const slots = defineSlots<{
  default?: () => VNode;
  footer?: () => VNode;
  header?: () => VNode;
}>();

const mask = shallowRef<HTMLElement | null>(null);
const dialog = shallowRef<HTMLElement | null>(null);

const { position, style: draggableStyle } = useDraggable(dialog, {
  containerElement: mask,
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

onClickOutside(dialog, () => {
  if (props.closeOnClickOutside && visible.value) {
    visible.value = false;
  }
});

onKeyStroke('Escape', (e) => {
  if (props.closeOnEsc && visible.value) {
    e.preventDefault();
    visible.value = false;
  }
});

watchEffect(() => {
  if (visible.value && props.positionStorageKey) {
    const storage = getStorage();
    storage.setItem(
      props.positionStorageKey,
      JSON.stringify({ x: position.value.x, y: position.value.y })
    );
  }
});

function getInitialPosition() {
  if (typeof props.positionStorageKey !== 'string') {
    return getDefaultPosition();
  }

  const storage = getStorage();
  const previousPosition = storage.getItem(props.positionStorageKey);
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
  return { x: screen.width / 2, y: screen.height / 2 };
}

function getStorage() {
  return props.positionStorageType === 'session' ? sessionStorage : localStorage;
}
</script>

<template>
  <Teleport :to="appendTo">
    <div v-if="visible" ref="mask" class="m-dialog-mask" :class="{ 'm-dialog-backdrop': modal }">
      <div ref="dialog" class="m-dialog" :class="dialogClass" :style="dialogComputedStyle">
        <div v-if="$slots.header" class="m-dialog-header" :class="headerClass" :style="headerStyle">
          <slot name="header"></slot>
        </div>
        <div class="m-dialog-content" :class="contentClass" :style="contentStyle">
          <slot></slot>
        </div>
        <div v-if="$slots.footer" class="m-dialog-footer" :class="footerClass" :style="footerStyle">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
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
  border-radius: var(--m-border-radius);
  background-color: var(--m-color-surface-container-high);
  padding: 1rem;
  pointer-events: auto;
}
</style>
