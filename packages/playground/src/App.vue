<script setup lang="ts">
import { repeat } from '@tb-dev/utils';
import { Command } from 'manatsu/src/index.ts';
import { computed, ref, shallowRef } from 'vue';
import { useDarkMode, useInvoke } from '@manatsu/composables/src/index.ts';
import {
  MButton,
  MDynamicLink,
  MScaffold,
  MTopAppbar,
  type SidebarItem,
  type TopAppbarMenuItem
} from '@manatsu/components/src/index.ts';

const darkMode = useDarkMode();

const topAppBar = shallowRef<InstanceType<typeof MTopAppbar> | null>(null);
const topAppBarHeight = ref(60);

const menuItems: TopAppbarMenuItem[] = [
  { key: 'home', label: 'Home', to: '/' },
  { key: 'about', label: 'About', to: '/about' }
];

const sidebarItemAmount = ref(100);
const sidebarItems = computed<SidebarItem[]>(() => {
  const items: SidebarItem[] = [];
  repeat(sidebarItemAmount.value, (i) => {
    items.push({ key: `Item ${i}` });
  });

  return items;
});

const { state: color, execute: getColor } = useInvoke<string>(Command.RandomHexColor);
</script>

<template>
  <MScaffold :sidebar-items="sidebarItems">
    <template #top-bar>
      <MTopAppbar
        ref="topAppBar"
        :menu-items="menuItems"
        :height="topAppBarHeight"
        logo="/peach.png"
        title="Manatsu"
        title-link="/"
      >
        <template #menu-item="{ label, to }">
          <MDynamicLink :to="to">{{ label }}</MDynamicLink>
        </template>

        <template #end>
          <div class="flex gap-2">
            <MButton variant="outlined" @click="$mana.toggleDarkMode()">
              {{ darkMode ? 'Light' : 'Dark' }}
            </MButton>
            <MButton
              variant="outlined"
              class="transition-none"
              :style="{ color }"
              @click="getColor"
            >
              {{ color }}
            </MButton>
          </div>
        </template>
      </MTopAppbar>
    </template>

    <template #sidebar-item="{ key }">
      <div :style="{ width: topAppBar?.startWidth }">
        {{ key }}
      </div>
    </template>

    <template #default>
      <RouterView />
    </template>

    <template #bottom-bar>
      <div class="w-full h-16 flex justify-center items-center">
        <span>Bottom bar</span>
      </div>
    </template>
  </MScaffold>
</template>
