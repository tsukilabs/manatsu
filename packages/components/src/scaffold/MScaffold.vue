<script setup lang="ts">
import { useElementSize } from '@manatsu/composables/src/index.ts';
import { getCurrentApp, privateSymbols, symbols } from '@manatsu/shared';
import { type MaybeRefOrGetter, type VNode, computed, inject, shallowRef, toRef } from 'vue';
import type { ScaffoldProps, SidebarItem } from './types';
import MDynamicDialog from '../dialog/MDynamicDialog.vue';

const sidebarItems = defineModel<SidebarItem[]>('sidebarItems');
const showSidebar = defineModel<boolean>('showSidebar', { default: true });

const props = withDefaults(defineProps<ScaffoldProps>(), {
  defaultBorder: '1px solid var(--m-color-outline-variant)',
  topBorder: true,
  bottomBorder: true
});

const slots = defineSlots<{
  bottom?: () => VNode;
  default?: () => VNode;
  'sidebar-item'?: (props: SidebarItem) => VNode;
  top?: () => VNode;
}>();

const app = getCurrentApp();

const topRef = shallowRef<HTMLElement | null>(null);
const { height: topHeight } = useElementSize(topRef);
app.provide(symbols.scaffoldTopHeight, topHeight);

const bottomRef = shallowRef<HTMLElement | null>(null);
const { height: bottomHeight } = useElementSize(bottomRef);
app.provide(symbols.scaffoldBottomHeight, bottomHeight);

// Content
const contentRef = shallowRef<HTMLElement | null>(null);
const { height: contentHeight } = useElementSize(contentRef);
app.provide(symbols.scaffoldContentHeight, contentHeight);

const contentHeightStyle = computed(() => {
  return `calc(100% - (${topHeight.value}px + ${bottomHeight.value}px))`;
});

// Sidebar
const sidebarRef = shallowRef<HTMLElement | null>(null);
const { width: sidebarWidth } = useElementSize(sidebarRef);
app.provide(symbols.scaffoldSidebarWidth, sidebarWidth);
app.provide(symbols.showScaffoldSidebar, showSidebar);

function toggleSidebar() {
  showSidebar.value = !showSidebar.value;
}

// Border
const topBorder = useBorder(() => props.topBorder);
const bottomBorder = useBorder(() => props.bottomBorder);

function useBorder(border: MaybeRefOrGetter<string | boolean>) {
  const borderRef = toRef(border);
  return computed(() => {
    if (!borderRef.value) return 'none';
    if (typeof borderRef.value === 'string') return borderRef.value;
    return props.defaultBorder;
  });
}

// Dialog
const shouldPlaceDialog = inject(privateSymbols.placeDialogOnScaffold);

defineExpose({
  sidebarWidth,
  topHeight,
  bottomHeight,
  contentHeight,
  toggleSidebar
});
</script>

<template>
  <div class="m-scaffold">
    <div v-if="$slots.top" ref="topRef" class="m-scaffold-top" :class="topClass" :style="topStyle">
      <slot name="top"></slot>
    </div>

    <div ref="contentRef" class="m-scaffold-content">
      <aside
        v-if="sidebarItems && sidebarItems.length > 0"
        ref="sidebarRef"
        class="m-scaffold-sidebar"
        :class="sidebarClass"
        :style="sidebarStyle"
      >
        <nav v-show="showSidebar">
          <div
            v-for="item of sidebarItems"
            :key="item.key"
            class="m-scaffold-sidebar-item"
            :class="sidebarItemClass"
            :style="sidebarItemStyle"
          >
            <slot name="sidebar-item" v-bind="item"></slot>
          </div>
        </nav>
      </aside>

      <div class="m-scaffold-content-slot" :class="contentClass" :style="contentStyle">
        <slot></slot>
      </div>
    </div>

    <div
      v-if="$slots.bottom"
      ref="bottomRef"
      class="m-scaffold-bottom"
      :class="bottomClass"
      :style="bottomStyle"
    >
      <slot name="bottom"></slot>
    </div>

    <m-dynamic-dialog v-if="shouldPlaceDialog" />
  </div>
</template>

<style lang="scss">
@use '@manatsu/style/mixins/flex';

/* This is applied to the top and bottom bars. */
@mixin outside {
  position: fixed;
  left: 0;
  z-index: 200;
  background-color: var(--m-color-surface);
  width: 100%;
  overflow: hidden;
}

.m-scaffold {
  position: fixed;
  inset: 0;
  background-color: var(--m-color-surface);
  overflow: hidden;

  &-top {
    @include outside;
    top: 0;
    border-bottom: v-bind('topBorder');
  }

  &-content {
    position: relative;
    top: v-bind('`${topHeight}px`');
    height: v-bind('contentHeightStyle');
  }

  &-sidebar {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: var(--m-color-surface);
    padding: v-bind("showSidebar ? 'var(--m-scaffold-sidebar-padding)' : '0'");
    overflow-x: hidden;

    & > nav {
      @include flex.x-start-y-center;
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  &-content-slot {
    position: absolute;
    inset: 0;
    left: v-bind('`${sidebarWidth}px`');
    background-color: var(--m-color-surface);
    padding: var(--m-scaffold-content-padding);
    overflow-x: hidden;
  }

  &-bottom {
    @include outside;
    bottom: 0;
    border-top: v-bind('bottomBorder');
  }
}
</style>
