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
  title?: () => VNode;
}>();

const classList = computed(() => {
  return [`m-card-${props.variant}`];
});

const hasHeader = computed(() => {
  return Boolean(props.title ?? slots.title ?? slots['header-start'] ?? slots['header-end']);
});

const hasFooter = computed(() => {
  return Boolean(slots.footer ?? (props.actions && props.actions.length > 0));
});

const mediaOrder = computed(() => {
  return props.mediaPosition === 'before' ? -1 : 0;
});

defineExpose({ hasHeader, hasFooter });
</script>

<template>
  <div class="m-card" :class="classList">
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
        v-if="title || $slots.title"
        class="m-card-title"
        :class="titleClass"
        :style="titleStyle"
        role="heading"
      >
        <slot v-if="$slots.title" name="title"></slot>
        <template v-else>
          <span>{{ title }}</span>
          <span v-if="subtitle">{{ subtitle }}</span>
        </template>
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
        <MButton
          v-for="{ key, label, onClick, ...action } of actions"
          :key="key"
          v-bind="action"
          @click="onClick"
        >
          {{ label }}
        </MButton>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@manatsu/sass/flex';

.m-card {
  @include flex.center;
  flex-direction: column;
  border-radius: var(--m-border-radius);
}

.m-card-outlined {
  border: 1px solid var(--m-color-outline);
  background-color: transparent;
  color: inherit;
}

.m-card-header {
  @include flex.x-between-y-center;
  gap: 1rem;
  padding: 1rem;
  width: 100%;

  @each $name in (start, end) {
    .m-card-header-#{$name} {
      @include flex.y-center;
      justify-content: flex-#{$name};
    }
  }
}

.m-card-title {
  @include flex.x-center-y-start;
  flex: 1 0 0;
  flex-direction: column;
  gap: 0.25rem;

  & > span:first-of-type {
    font-weight: 500;
    font-size: 1rem;
  }

  & > span:first-of-type + span {
    font-weight: 400;
    font-size: 0.875rem;
  }
}

.m-card-media {
  order: v-bind('mediaOrder');
  width: 100%;
  overflow: hidden;
}

.m-card-content {
  padding: 1rem;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.m-card-footer {
  @include flex.x-end-y-center;
  gap: 0.5rem;
  padding: 0.5rem;
  width: 100%;
}
</style>
