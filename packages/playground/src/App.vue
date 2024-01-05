<script setup lang="ts">
import { inject, ref } from 'vue';
import { darkModeKey } from 'manatsu/src/index.ts';
import {
  MBrand,
  MButton,
  MDynamicLink,
  MNavbar,
  MScaffold,
  type NavbarMenuItem
} from '@manatsu/components/src/index.ts';
import peach from '/peach.png';

const darkMode = inject(darkModeKey, () => ref<boolean | 'auto'>(false), true);

const menuItems: NavbarMenuItem[] = [
  { key: 'first', label: 'First item' },
  { key: 'second', label: 'Second item', to: 'https://example.com' },
  { key: 'third', label: 'Third item' }
];

function toggleDarkMode() {
  darkMode.value = !darkMode.value;
}
</script>

<template>
  <MScaffold>
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

        <template #item="{ label, to }">
          <MDynamicLink :to="to">{{ label }}</MDynamicLink>
        </template>

        <template #end>
          <MButton outlined @click="toggleDarkMode">Action</MButton>
        </template>
      </MNavbar>
    </template>

    <RouterView />
  </MScaffold>
</template>
