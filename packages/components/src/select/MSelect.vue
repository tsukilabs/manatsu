<script setup lang="ts">
import { toPixel } from '@tb-dev/utils';
import { toArray } from '@tb-dev/utils/array';
import { injectStrict, symbols } from '@manatsu/shared';
import { onClickOutside, useElementBounding } from '@vueuse/core';
import { type VNode, computed, ref, shallowRef, watch } from 'vue';
import { getUniqueId } from './utils';
import MSelectTrigger from './MSelectTrigger.vue';
import type { SelectOption, SelectProps } from './types';

const model = defineModel<any>();

const props = defineProps<SelectProps>();

const slots = defineSlots<{
  option?: (slotProps: SelectOption) => VNode;
}>();

const id = getUniqueId();

// Select
const selectRef = shallowRef<HTMLElement | null>(null);
const { width, bottom, left, update } = useElementBounding(selectRef);

const windowHeight = injectStrict(symbols.windowHeight);
const windowWidth = injectStrict(symbols.windowWidth);
watch([model, windowHeight, windowWidth], () => update(), { deep: false });

const classList = computed(() => {
  return ['m-select', props.disabled && 'm-select-disabled'];
});

// Dropdown
const visible = ref(false);
const dropdownRef = shallowRef<HTMLElement | null>(null);
onClickOutside(dropdownRef, () => (visible.value &&= false));

const windowFocus = injectStrict(symbols.windowFocus);
watch(windowFocus, (hasFocus) => {
  if (!hasFocus) visible.value &&= false;
});

function toggle() {
  update();
  if (props.disabled) return;
  visible.value = !visible.value;
}

function setValue(option: SelectOption) {
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

function getOptionClassList(option: SelectOption) {
  return [props.optionsClass, isSelected(option) && 'm-select-selected'];
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
      @click="toggle"
    >
      {{ model ?? placeholder }}
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
          :class="getOptionClassList(option)"
          :style="optionsStyle"
          @click="setValue(option)"
        >
          <slot name="option" v-bind="option">
            <span>{{ option.value }}</span>
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
  min-height: calc(1rem + (2 * 0.4rem));

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
  }

  &-dropdown {
    @include container;
    position: fixed;
    top: v-bind('toPixel(bottom + 1)');
    left: v-bind('toPixel(left)');
    z-index: 1000;
    padding: 0.2rem;
    width: v-bind('toPixel(width)');
    max-height: 200px;
    overflow-y: auto;
    list-style: none;
  }

  &-dropdown > li {
    @include option;

    &:hover:not(.m-select-selected) {
      background-color: var(--m-color-surface-container);
    }
  }

  &-selected {
    background-color: var(--m-color-primary);
    color: var(--m-color-on-primary);
  }
}
</style>
