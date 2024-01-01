<script setup lang="ts">
import { useToPixel } from '@manatsu/composables/src/index.ts';
import NavbarLogo from './NavbarLogo.vue';
import NavbarMenu from './NavbarMenu.vue';
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
      <DynamicLink class="m-navbar-title-link" :to="titleLink">
        <NavbarLogo v-if="logo" :logo="logo" :style="logoStyle" />
        <NavbarTitle v-if="title" :title="title" :style="titleStyle" />
      </DynamicLink>
    </div>

    <div class="m-navbar-content">
      <NavbarMenu
        v-if="menuItems && menuItems.length > 0"
        :items="menuItems"
        :style="menuStyle"
      />
      <div
        v-if="socialLinks && socialLinks.length > 0"
        class="m-navbar-social-links"
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
@use '../style';

.m-navbar {
  @include style.flex-x-between-y-center;
  padding: 0 1rem;
  width: v-bind('width');
  height: v-bind('height');
  user-select: none;
  white-space: nowrap;
}

.m-navbar > div:first-child {
  @include style.flex-y-center;

  & > * {
    @include style.flex-y-center;
  }
}

.m-navbar-content {
  @include style.flex-x-end;
  flex: 1 1 auto;

  .m-navbar-social-links {
    @include style.flex-y-center;
  }
}
</style>
