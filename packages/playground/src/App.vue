<script setup lang="ts">
import {
  MBrand,
  MButton,
  MDynamicLink,
  MNavbar,
  MScaffold,
  type NavbarMenuItem,
  type SidebarItem
} from '@manatsu/components/src/index.ts';
import peach from '/peach.png';

const menuItems: NavbarMenuItem[] = [
  { key: 'first', label: 'First item' },
  { key: 'second', label: 'Second item', to: 'https://example.com' },
  { key: 'third', label: 'Third item' }
];

const sidebarItems: SidebarItem[] = [
  { key: 'first' },
  { key: 'second' },
  { key: 'third' }
];
</script>

<template>
  <MScaffold :sidebar-items="sidebarItems">
    <template #header>
      <MNavbar :menu-items="menuItems">
        <template #start>
          <MBrand title-link="/">
            <template #logo>
              <img :src="peach" />
            </template>
            <template #title>Manatsu</template>
          </MBrand>
        </template>

        <template #menu-item="{ label, to }">
          <MDynamicLink :to="to">{{ label }}</MDynamicLink>
        </template>

        <template #end>
          <MButton outlined @click="$mana.toggleDarkMode">Action</MButton>
        </template>
      </MNavbar>
    </template>

    <template #sidebar-item="{ key }">
      <div>{{ key }}</div>
    </template>

    <RouterView />
  </MScaffold>
</template>
