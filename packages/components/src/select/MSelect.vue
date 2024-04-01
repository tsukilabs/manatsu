<script setup lang="ts">
import { toPixel } from '@tb-dev/utils';
import { toArray } from '@tb-dev/utils/array';
import { injectStrict, symbols } from '@manatsu/shared';
import { onClickOutside, useElementBounding, watchDeep } from '@vueuse/core';
import { type CSSProperties, type VNode, computed, ref, shallowRef, watch } from 'vue';
import { getUniqueId } from './utils';
import MSelectLabel from './MSelectLabel.vue';
import MSelectChips from './MSelectChips.vue';
import MSelectTrigger from './MSelectTrigger.vue';
import MEllipsis from '../ellipsis/MEllipsis.vue';
import type { SelectOption, SelectProps } from './types';

const model = defineModel<any>();

const props = withDefaults(defineProps<SelectProps>(), {
  chips: true,
  hideOnWindowBlur: true,
  transform: String
});

const slots = defineSlots<{
  option?: (slotProps: SelectOption) => VNode;
}>();

const id = getUniqueId();

// Select
const selectRef = shallowRef<HTMLElement | null>(null);
const { width, bottom, left, update: updateBounding } = useElementBounding(selectRef);

const classList = computed(() => {
  return ['m-select', props.disabled && 'm-select-disabled'];
});

// Dropdown
const visible = ref(false);
const dropdownRef = shallowRef<HTMLElement | null>(null);
onClickOutside(dropdownRef, () => (visible.value &&= false));

const windowHeight = injectStrict(symbols.windowHeight);
const windowWidth = injectStrict(symbols.windowWidth);
watchDeep([visible, model, windowHeight, windowWidth], updateBounding);

const dropdownPosition = computed<CSSProperties>(() => {
  return {
    position: 'fixed',
    top: toPixel(bottom.value + 1),
    left: toPixel(left.value)
  };
});

const dropdownComputedStyle = computed(() => {
  return [props.dropdownStyle, dropdownPosition.value];
});

const windowFocus = injectStrict(symbols.windowFocus);
watch(windowFocus, (hasFocus) => {
  if (!hasFocus && props.hideOnWindowBlur) visible.value &&= false;
});

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
    <div
      class="m-select-label"
      :class="labelClass"
      :style="labelStyle"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="visible"
      :aria-controls="`m-select-dropdown-${id}`"
      :aria-label="ariaLabel"
      @click="toggle"
    >
      <m-select-chips v-if="multiple && chips" v-model="model" :placeholder :transform />
      <m-select-label v-else v-model="model" :placeholder :transform />
    </div>

    <m-select-trigger @click="toggle" />

    <teleport v-if="visible" to="body">
      <ul
        :id="`m-select-dropdown-${id}`"
        ref="dropdownRef"
        role="listbox"
        class="m-select-dropdown"
        :class="dropdownClass"
        :style="dropdownComputedStyle"
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
            <m-ellipsis>{{ transform(option.value) }}</m-ellipsis>
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
  @include flex.x-start-y-center;
  padding: 0.4rem 0.75em;
}

.m-select {
  @include container;
  @include flex.x-between-y-center;
  @include transition.ease-in-out(border-color box-shadow, 0.2s);
  cursor: pointer;

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
    width: 100%;
    min-height: calc(1rem + (2 * 0.75em));
  }

  &-dropdown {
    @include container;
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
    cursor: pointer;

    @include utils.hover {
      background-color: var(--m-color-surface-container);
    }
  }

  &-selected {
    color: var(--m-color-primary);
  }
}
</style>
