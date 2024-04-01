<script setup lang="ts">
import { type VNode, computed, ref } from 'vue';
import { defineEmptyComponent } from '@manatsu/shared';
import type { ChipProps } from './types';
import MChipClose from './MChipClose.vue';
import MEllipsis from '../ellipsis/MEllipsis.vue';

const props = withDefaults(defineProps<ChipProps>(), {
  variant: 'outlined'
});

const emit = defineEmits<(e: 'remove') => void>();

defineSlots<{ default?: () => VNode }>();

const visible = ref(true);
const emptyComponent = defineEmptyComponent();

const classList = computed(() => {
  return ['m-chip', `m-chip-${props.variant}`, props.removable && 'm-chip-removable'];
});

function remove() {
  visible.value = false;
  emit('remove');
}
</script>

<template>
  <div v-if="visible" :class="classList">
    <div class="m-chip-label">
      <m-ellipsis>
        <slot>{{ label }}</slot>
      </m-ellipsis>
    </div>
    <m-chip-close v-if="removable" @click.stop="remove" />
  </div>
  <empty-component v-else />
</template>

<style lang="scss">
@use '@manatsu/style/mixins/flex';
@use '@manatsu/style/mixins/shadow';

.m-chip {
  @include flex.center;
  flex-wrap: nowrap;
  border-radius: var(--m-border-radius);
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  font-family: inherit;

  &-label {
    @include flex.x-start-y-center;
    flex-grow: 1;
    min-width: 0;
  }

  &-removable {
    justify-content: space-between;
    gap: 0.25rem;
  }

  &-elevated {
    @include shadow.box-15;
    background-color: var(--m-color-surface-container-low);
    color: var(--m-color-primary);
  }

  &-outlined {
    border: 1px solid var(--m-color-outline);
    background-color: transparent;
    color: inherit;
  }
}
</style>
