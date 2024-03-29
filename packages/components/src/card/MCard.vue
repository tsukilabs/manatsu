<script setup lang="ts">
import { type VNode, computed } from 'vue';
import { MButton } from '../button';
import type { CardProps } from './types';

const props = withDefaults(defineProps<CardProps>(), {
  mediaPosition: 'after',
  variant: 'filled'
});

const slots = defineSlots<{
  default: () => VNode;
  footer?: () => VNode;
  'header-end'?: () => VNode;
  'header-start'?: () => VNode;
  media?: () => VNode;
  subtitle?: () => VNode;
  title?: () => VNode;
}>();

const classList = computed(() => {
  return ['m-card', `m-card-${props.variant}`];
});

const hasTitle = computed(() => {
  return Boolean(slots.title ?? props.title);
});

const hasHeader = computed(() => {
  if (hasTitle.value) return true;
  return Boolean(slots['header-start'] ?? slots['header-end']);
});

const hasFooter = computed(() => {
  return Boolean(slots.footer ?? (props.actions && props.actions.length > 0));
});

const mediaOrder = computed(() => {
  return props.mediaPosition === 'before' ? -1 : 0;
});
</script>

<template>
  <div :class="classList">
    <div v-if="hasHeader" class="m-card-header" :class="headerClass" :style="headerStyle">
      <div
        v-if="$slots['header-start']"
        class="m-card-header-start"
        :class="headerStartClass"
        :style="headerStartStyle"
      >
        <slot name="header-start"></slot>
      </div>

      <div
        v-if="hasTitle"
        class="m-card-title"
        :class="titleClass"
        :style="titleStyle"
        role="heading"
      >
        <slot v-if="$slots.title" name="title"></slot>
        <span v-else>{{ title }}</span>

        <div
          v-if="subtitle || $slots.subtitle"
          class="m-card-subtitle"
          :class="subtitleClass"
          :style="subtitleStyle"
        >
          <slot v-if="$slots.subtitle" name="subtitle"></slot>
          <span v-else>{{ subtitle }}</span>
        </div>
      </div>

      <div
        v-if="$slots['header-end']"
        class="m-card-header-end"
        :class="headerEndClass"
        :style="headerEndStyle"
      >
        <slot name="header-end"></slot>
      </div>
    </div>

    <div v-if="$slots.media" class="m-card-media" :class="mediaClass" :style="mediaStyle">
      <slot name="media"></slot>
    </div>

    <div class="m-card-content" :class="contentClass" :style="contentStyle">
      <slot></slot>
    </div>

    <div v-if="hasFooter" class="m-card-footer" :class="footerClass" :style="footerStyle">
      <slot v-if="$slots.footer" name="footer"></slot>
      <template v-else-if="actions">
        <m-button
          v-for="{ key, onClick, ...action } of actions"
          :key
          v-bind="action"
          @click="onClick"
        />
      </template>
    </div>
  </div>
</template>

<style lang="scss">
@use '@manatsu/style/mixins/flex';

.m-card {
  @include flex.center;
  flex-direction: column;
  border-radius: var(--m-border-radius);

  &-filled {
    background-color: var(--m-color-surface-container-highest);
    color: var(--m-color-on-surface);
  }

  &-elevated {
    box-shadow:
      0 1px 2px 0 rgb(0 0 0 / 30%),
      0 1px 3px 1px rgb(0 0 0 / 15%);
    background-color: var(--m-color-surface-container-low);
  }

  &-outlined {
    border: 1px solid var(--m-color-outline-variant);
    background-color: transparent;
    color: inherit;
  }

  &-header {
    @include flex.x-between-y-center;
    gap: 1rem;
    padding: 1rem;
    width: 100%;

    &-start {
      @include flex.y-center;
      justify-content: flex-start;
    }

    &-end {
      @include flex.y-center;
      justify-content: flex-end;
    }
  }

  &-title {
    @include flex.x-center-y-start;
    flex: 1 0 0;
    flex-direction: column;
    gap: 0.25rem;

    & > :not(.m-card-subtitle) {
      font-weight: 500;
      font-size: 1rem;
    }
  }

  &-subtitle > * {
    font-weight: 400;
    font-size: 0.875rem;
  }

  &-media {
    order: v-bind('mediaOrder');
    width: 100%;
    overflow: hidden;
  }

  &-content {
    padding: 1rem;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  &-footer {
    @include flex.x-end-y-center;
    gap: 0.5rem;
    padding: 0.5rem;
    width: 100%;
  }
}
</style>
