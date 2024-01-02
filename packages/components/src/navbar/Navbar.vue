<script setup lang="ts">
import { useToPixel } from '@manatsu/composables/src/index.ts';
import NavbarLogo from './NavbarLogo.vue';
import type { NavbarProps } from './types';
import NavbarTitle from './NavbarTitle.vue';
import IconLink from '../link/IconLink.vue';
import DynamicLink from '../link/DynamicLink.vue';

const props = withDefaults(defineProps<NavbarProps>(), {
  height: '60px',
  width: '100%'
});

const height = useToPixel(() => props.height);
const width = useToPixel(() => props.width);
</script>

<template>
  <header class="m-navbar" :style="style">
    <div>
      <DynamicLink :to="titleLink">
        <NavbarLogo
          v-if="logo"
          class="m-navbar-logo"
          :logo="logo"
          :style="logoStyle"
        />
        <NavbarTitle
          v-if="title"
          class="m-navbar-title"
          :title="title"
          :style="titleStyle"
        />
      </DynamicLink>
    </div>

    <div class="m-navbar-content">
      <div
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
            <span v-else>{{ item.label ?? item.key }}</span>
          </DynamicLink>
        </div>
      </div>

      <div
        v-if="socialLinks && socialLinks.length > 0"
        class="m-navbar-social"
        :style="socialLinksStyle"
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

.m-navbar > div:first-child {
  @include flex.y-center;

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
