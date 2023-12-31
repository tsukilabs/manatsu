<script setup lang="ts">
import NavbarLogo from './NavbarLogo.vue';
import NavbarMenu from './NavbarMenu.vue';
import type { NavbarProps } from './types';
import NavbarTitle from './NavbarTitle.vue';
import IconLink from '../link/IconLink.vue';
import DynamicLink from '../link/DynamicLink.vue';

defineProps<NavbarProps>();
</script>

<template>
  <header class="m-navbar">
    <DynamicLink :to="titleLink" class="m-navbar-title-link">
      <NavbarLogo v-if="logo" :logo="logo" />
      <NavbarTitle v-if="title" :title="title" />
    </DynamicLink>

    <NavbarMenu v-if="items && items.length > 0" :items="items" />

    <div
      v-if="socialLinks && socialLinks.length > 0"
      class="m-navbar-social-links"
    >
      <IconLink
        v-for="link of socialLinks"
        :key="link.to"
        :to="link.to"
        :icon="link.icon"
      />
    </div>
  </header>
</template>

<style scoped lang="scss">
:global(:root) {
  --m-navbar-height: 60px;
  --m-navbar-padding: 0 1rem;
  --m-navbar-width: 100%;
}

.m-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--m-navbar-padding);
  width: var(--m-navbar-width);
  height: var(--m-navbar-height);
  user-select: none;
  white-space: nowrap;
}

.m-navbar-title-link {
  display: flex;
  align-items: center;
}

.m-navbar-social-links {
  display: flex;
}
</style>
