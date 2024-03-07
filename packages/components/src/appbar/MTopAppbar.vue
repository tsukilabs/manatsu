<script setup lang="ts">
import { toPixel } from '@tb-dev/utils';
import { type VNode, computed, shallowRef } from 'vue';
import { useElementSize } from '@manatsu/composables/src/index.ts';
import MDynamicLink from '../dynamic-link/MDynamicLink.vue';
import type { TopAppbarMenuItem, TopAppbarProps } from './types';

const menuItems = defineModel<TopAppbarMenuItem[]>('menuItems');

const props = withDefaults(defineProps<TopAppbarProps>(), {
  contentAlignment: 'end',
  height: '60px'
});

const slots = defineSlots<{
  content?: () => VNode;
  end?: () => VNode;
  logo?: () => VNode;
  'menu-item'?: (slotProps: TopAppbarMenuItem) => VNode;
  start?: () => VNode;
  title?: () => VNode;
}>();

const appbarHeight = computed(() => toPixel(props.height));

const hasLogo = computed(() => Boolean(props.logo ?? slots.logo));
const hasTitle = computed(() => Boolean(props.title ?? slots.title));
const hasStart = computed(() => {
  if (hasTitle.value || hasLogo.value) return true;
  return Boolean(slots.start);
});

const hasContent = computed(() => {
  if (menuItems.value && menuItems.value.length > 0) return true;
  return Boolean(slots.content);
});

const alignment = computed(() => {
  if (props.contentAlignment === 'start') return 'flex-start';
  if (props.contentAlignment === 'center') return 'center';
  return 'flex-end';
});

const startRef = shallowRef<HTMLElement | null>(null);
const { width: startWidth } = useElementSize(startRef);

const endRef = shallowRef<HTMLElement | null>(null);
const { width: endWidth } = useElementSize(endRef);

defineExpose({ startWidth, endWidth });
</script>

<template>
  <header class="m-top-appbar">
    <div
      v-if="hasStart"
      ref="startRef"
      class="m-top-appbar-start"
      :class="startClass"
      :style="startStyle"
    >
      <slot v-if="$slots.start" name="start"></slot>

      <m-dynamic-link
        v-else
        :to="titleLink"
        class="m-top-appbar-brand"
        :class="titleLinkClass"
        :style="titleLinkStyle"
      >
        <div v-if="hasLogo" class="m-top-appbar-logo" :class="logoClass" :style="logoStyle">
          <slot v-if="$slots.logo" name="logo"></slot>
          <img v-else :src="logo" />
        </div>

        <div v-if="hasTitle" class="m-top-appbar-title" :class="titleClass" :style="titleStyle">
          <slot v-if="$slots.title" name="title"></slot>
          <span v-else>{{ title }}</span>
        </div>
      </m-dynamic-link>
    </div>

    <div v-if="hasContent" class="m-top-appbar-content" :class="contentClass" :style="contentStyle">
      <slot v-if="$slots.content" name="content"></slot>
      <nav
        v-else-if="menuItems && menuItems.length > 0"
        class="m-top-appbar-menu"
        :class="menuClass"
        :style="menuStyle"
      >
        <div
          v-for="item of menuItems"
          :key="item.key"
          class="m-top-appbar-menu-item"
          :class="menuItemClass"
          :style="menuItemStyle"
        >
          <slot name="menu-item" v-bind="item"></slot>
        </div>
      </nav>
    </div>

    <div
      v-if="$slots.end"
      ref="endRef"
      class="m-top-appbar-end"
      :class="endClass"
      :style="endStyle"
    >
      <slot name="end"></slot>
    </div>
  </header>
</template>

<style lang="scss">
@use '@manatsu/sass/flex';

.m-top-appbar {
  @include flex.x-between-y-center;
  gap: 1.5rem;
  padding: 0 1rem;
  width: 100%;
  height: v-bind('appbarHeight');
  overflow: hidden;
  white-space: nowrap;

  &-start {
    @include flex.x-start-y-center;
  }

  &-end {
    @include flex.x-end-y-center;
  }

  &-brand {
    @include flex.y-center;

    & > :first-child {
      @include flex.y-center;
    }
  }

  &-logo {
    @include flex.y-center;
    margin: 0 8px 0 0;
  }

  &-title {
    @include flex.y-center;
    font-weight: 600;
    font-size: 1.5rem;
  }

  &-content {
    @include flex.y-center;
    flex: 1 0 0;
    justify-content: v-bind('alignment');
    width: 100%;
  }

  &-menu {
    @include flex.x-end-y-center;
    gap: 1.5rem;
  }
}
</style>
