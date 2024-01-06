<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDarkMode } from '@manatsu/composables/src/index.ts';
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

const darkMode = useDarkMode();
const darkModeLabel = computed(() => (darkMode.value ? 'Light' : 'Dark'));

const navbar = ref<InstanceType<typeof MNavbar> | null>(null);

const menuItems: NavbarMenuItem[] = [
  { key: 'first', label: 'First item' },
  { key: 'second', label: 'Second item', to: 'https://example.com' },
  { key: 'third', label: 'Third item' }
];

const sidebarItems: SidebarItem[] = [{ key: 'first' }, { key: 'second' }, { key: 'third' }];
</script>

<template>
  <MScaffold :sidebar-items="sidebarItems">
    <template #header>
      <MNavbar ref="navbar" :menu-items="menuItems">
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
          <MButton variant="outlined" @click="$mana.toggleDarkMode">
            {{ darkModeLabel }}
          </MButton>
        </template>
      </MNavbar>
    </template>

    <template #sidebar-item="{ key }">
      <div :style="{ width: navbar?.startWidth }">
        {{ key }}
      </div>
    </template>

    <RouterView />
  </MScaffold>
</template>
