<script setup lang="ts">
import type { VNode } from 'vue';
import { useToPixel } from '@manatsu/composables/src/index.ts';
import type { NavbarProps } from './types';
import IconLink from '../link/IconLink.vue';
import DynamicLink from '../link/DynamicLink.vue';

const props = withDefaults(defineProps<NavbarProps>(), {
  height: '60px',
  width: '100%'
});

defineSlots<{
  logo?: () => VNode;
  title?: () => VNode;
}>();

const height = useToPixel(() => props.height);
const width = useToPixel(() => props.width);
</script>

<template>
  <header class="m-navbar" :style="style">
    <div class="m-navbar-brand">
      <DynamicLink :to="titleLink">
        <div v-if="$slots.logo" class="m-navbar-logo" :style="logoStyle">
          <slot name="logo"></slot>
        </div>

        <div v-if="$slots.title" class="m-navbar-title" :style="titleStyle">
          <slot name="title"></slot>
        </div>
      </DynamicLink>
    </div>

    <div class="m-navbar-content">
      <nav
        v-if="menuItems && menuItems.length > 0"
        class="m-navbar-menu"
        :style="menuStyle"
      >
        <div
          v-for="item of menuItems"
          :key="item.key"
          class="m-navbar-menu-item"
          role="none"
        >
          <DynamicLink :to="item.to">
            <component
              :is="item.label"
              v-if="typeof item.label === 'function'"
            />
            <span v-else>{{ item.label }}</span>
          </DynamicLink>
        </div>
      </nav>

      <div
        v-if="socialLinks && socialLinks.length > 0"
        class="m-navbar-social"
        :style="socialStyle"
      >
        <IconLink
          v-for="link of socialLinks"
          :key="link.to"
          :to="link.to"
          :icon="link.icon"
        />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@manatsu/sass/flex';

.m-navbar {
  @include flex.x-between-y-center;
  padding: 0 1rem;
  width: v-bind('width');
  height: v-bind('height');
  user-select: none;
  white-space: nowrap;
}

.m-navbar-brand {
  @include flex.y-center;

  /** Make the dynamic-link flex. */
  & > :first-child {
    @include flex.y-center;
  }

  @each $name in (logo, title) {
    .m-navbar-#{$name} {
      @include flex.y-center;
    }
  }

  .m-navbar-logo {
    margin: 0 8px 0 0;
  }

  .m-navbar-title {
    font-weight: 600;
    font-size: 1.5rem;
  }
}

.m-navbar-content {
  @include flex.x-end;
  flex: 1 1 auto;
  gap: 1rem;

  & > :not(:first-child)::before {
    margin-right: 4px;
    background-color: var(--m-color-outline);
    width: 1px;
    height: 24px;
    content: '';
  }

  @each $name in (menu, social) {
    .m-navbar-#{$name} {
      @include flex.y-center;
    }
  }

  .m-navbar-menu {
    gap: 1.5rem;

    &:not(:only-child) {
      margin-right: 4px;
    }
  }
}
</style>
