<script setup lang="ts">
import { type VNode, computed, shallowRef } from 'vue';
import { usePixelWidth, useToPixel } from '@manatsu/composables/src/index.ts';
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
  'menu-item'?: (props: TopAppbarMenuItem) => VNode;
  start?: () => VNode;
  title?: () => VNode;
}>();

const height = useToPixel(() => props.height);

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

const start = shallowRef<HTMLElement | null>(null);
const startWidth = usePixelWidth(start);

const end = shallowRef<HTMLElement | null>(null);
const endWidth = usePixelWidth(end);

defineExpose({ startWidth, endWidth });
</script>

<template>
  <header class="m-top-appbar">
    <div
      v-if="hasStart"
      ref="start"
      class="m-top-appbar-start"
      :class="startClass"
      :style="startStyle"
    >
      <slot v-if="$slots.start" name="start"></slot>

      <MDynamicLink
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
      </MDynamicLink>
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

    <div v-if="$slots.end" ref="end" class="m-top-appbar-end" :class="endClass" :style="endStyle">
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
  height: v-bind('height');
  overflow: hidden;
  white-space: nowrap;

  &-start {
    @include flex.y-center;
    justify-content: flex-start;
  }

  &-end {
    @include flex.y-center;
    justify-content: flex-end;
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
  }

  &-menu {
    @include flex.x-end-y-center;
    gap: 1.5rem;
  }
}
</style>