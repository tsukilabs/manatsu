<script setup lang="ts">
import { toArray } from '@tb-dev/utils/array';
import { isEmpty, toPixel } from '@tb-dev/utils';
import { injectStrict, symbols } from '@manatsu/shared';
import { onClickOutside, useElementBounding } from '@vueuse/core';
import { type VNode, computed, ref, shallowRef, toValue, triggerRef, watch } from 'vue';
import { getUniqueId } from './utils';
import MSelectTrigger from './MSelectTrigger.vue';
import type { SelectOption, SelectProps } from './types';

const model = defineModel<any>();

const props = withDefaults(defineProps<SelectProps>(), {
  hideOnWindowBlur: true,
  transform: String
});

const slots = defineSlots<{
  option?: (slotProps: SelectOption) => VNode;
}>();

const id = getUniqueId();

// Select
const selectRef = shallowRef<HTMLElement | null>(null);
const { width, bottom, left, update } = useElementBounding(selectRef);

const label = computed(() => {
  const value = toValue(model.value);
  if (isEmpty(value)) return props.placeholder;
  if (Array.isArray(value)) return value.map(props.transform).join(', ');
  return props.transform(value);
});

const classList = computed(() => {
  return ['m-select', props.disabled && 'm-select-disabled'];
});

// Dropdown
const visible = ref(false);
const dropdownRef = shallowRef<HTMLElement | null>(null);
onClickOutside(dropdownRef, () => (visible.value &&= false));

const windowFocus = injectStrict(symbols.windowFocus);
watch(windowFocus, (hasFocus) => {
  if (!hasFocus && props.hideOnWindowBlur) visible.value &&= false;
});

const windowHeight = injectStrict(symbols.windowHeight);
const windowWidth = injectStrict(symbols.windowWidth);
watch([visible, model, label, windowHeight, windowWidth], () => update(), { deep: false });

function toggle() {
  if (props.disabled) return;
  visible.value = !visible.value;
}

function updateValue(option: SelectOption) {
  if (props.multiple) {
    const value = toArray(model.value);

    if (isSelected(option)) {
      value.splice(value.indexOf(option.value), 1);
    } else {
      value.push(option.value);
    }

    model.value = value;

    // Selected options won't update if the model is a shallowRef.
    triggerRef(model);
  } else {
    model.value = option.value;
    visible.value = false;
  }
}

function isSelected(option: SelectOption) {
  if (Array.isArray(model.value)) return model.value.includes(option.value);
  return option.value === model.value;
}
</script>

<template>
  <div :id="`m-select-${id}`" ref="selectRef" :class="classList">
    <!-- eslint-disable vue/v-bind-style -->
    <span
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="visible"
      :aria-controls="`m-select-dropdown-${id}`"
      :aria-label="ariaLabel"
      class="m-select-label"
      :class="labelClass"
      :style="labelStyle"
      @click="toggle"
    >
      {{ label }}
    </span>

    <m-select-trigger @click="toggle" />

    <teleport v-if="visible" to="body">
      <ul
        :id="`m-select-dropdown-${id}`"
        ref="dropdownRef"
        role="listbox"
        class="m-select-dropdown"
        :class="dropdownClass"
        :style="dropdownStyle"
      >
        <li
          v-for="(option, index) of options"
          :id="`m-select-option-${id}-${index}`"
          :key="option.key"
          role="option"
          :class="[optionsClass, isSelected(option) ? 'm-select-selected' : null]"
          :style="optionsStyle"
          @click="updateValue(option)"
        >
          <slot name="option" v-bind="option">
            <span>{{ transform(option.value) }}</span>
          </slot>
        </li>
      </ul>
    </teleport>
  </div>
</template>

<style lang="scss">
@use '@manatsu/style/mixins/flex';
@use '@manatsu/style/mixins/shadow';
@use '@manatsu/style/mixins/transition';
@use '@manatsu/style/mixins/utils';

@mixin container {
  border: 1px solid var(--m-color-outline);
  border-radius: var(--m-border-radius);
  background-color: var(--m-color-surface-container-lowest);
  font-size: 1rem;
  user-select: none;
}

@mixin option {
  @include flex.x-start-y-center($inline: true);
  padding: 0.4rem 0.75em;
  width: 100%;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-select {
  @include container;
  @include flex.x-between-y-center($inline: true);
  @include transition.ease-in-out(border-color box-shadow, 0.2s);

  &-disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:hover:not(&-disabled) {
    @include shadow.box-15;
    border-color: var(--m-color-primary);
  }

  &-label {
    @include option;
    min-height: calc(1rem + (2 * 0.75em));
  }

  &-dropdown {
    @include container;
    position: fixed;
    top: v-bind('toPixel(bottom + 1)');
    left: v-bind('toPixel(left)');
    z-index: 1100;
    box-shadow:
      0 4px 6px -1px rgba(0 0 0 / 10%),
      0 2px 4px -2px rgba(0 0 0 / 10%);
    padding: 0.2rem;
    width: v-bind('toPixel(width)');
    max-height: 200px;
    overflow-y: auto;
    list-style: none;
  }

  &-dropdown > li {
    @include option;

    @include utils.hover {
      background-color: var(--m-color-surface-container);
    }
  }

  &-selected {
    color: var(--m-color-primary);
  }
}
</style>
