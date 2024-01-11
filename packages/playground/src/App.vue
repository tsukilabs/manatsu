<script setup lang="ts">
import { repeat } from '@tb-dev/utils';
import { computed, ref, shallowRef } from 'vue';
import { useDarkMode, useInvoke } from '@manatsu/composables/src/index.ts';
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

const navbar = shallowRef<InstanceType<typeof MNavbar> | null>(null);
const navbarHeight = ref(60);

const menuItems: NavbarMenuItem[] = [
  { key: 'first', label: 'First item' },
  { key: 'second', label: 'Second item', to: 'https://example.com' },
  { key: 'third', label: 'Third item' }
];

const sidebarItemAmount = ref(100);
const sidebarItems = computed<SidebarItem[]>(() => {
  const items: SidebarItem[] = [];
  repeat(sidebarItemAmount.value, (i) => {
    items.push({ key: `Item ${i}` });
  });

  return items;
});

const { state: footerText } = useInvoke<string>('footer_text');
</script>

<template>
  <MScaffold :sidebar-items="sidebarItems">
    <template #header>
      <MNavbar ref="navbar" :menu-items="menuItems" :height="navbarHeight">
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
          <div class="flex gap-2">
            <MButton variant="outlined" @click="$mana.toggleDarkMode()">
              {{ darkModeLabel }}
            </MButton>
            <MButton variant="outlined" @click="sidebarItemAmount += 5">Action</MButton>
          </div>
        </template>
      </MNavbar>
    </template>

    <template #sidebar-item="{ key }">
      <div :style="{ width: navbar?.startWidth }">
        {{ key }}
      </div>
    </template>

    <template #default>
      <RouterView />
    </template>

    <template #footer>
      <div class="w-full h-16 flex justify-center items-center">{{ footerText }}</div>
    </template>
  </MScaffold>
</template>
