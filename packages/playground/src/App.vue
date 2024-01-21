<script setup lang="ts">
import { useRoute } from 'vue-router';
import { startCase } from 'lodash-es';
import { useLocalStorage } from '@vueuse/core';
import { Command } from 'manatsu/src/index.ts';
import { ref, shallowRef, watchEffect } from 'vue';
import { useDarkMode, useInvoke } from '@manatsu/composables/src/index.ts';
import {
  MButton,
  MDynamicLink,
  MScaffold,
  MTopAppbar,
  type SidebarItem,
  type TopAppbarMenuItem
} from '@manatsu/components/src/index.ts';
import { StorageKey } from './enum';
import { components } from './routes';

const route = useRoute();
const lastRoute = useLocalStorage(StorageKey.LastRoute, '/');
watchEffect(() => (lastRoute.value = route.path));

const darkMode = useDarkMode();

const topAppBar = shallowRef<InstanceType<typeof MTopAppbar> | null>(null);
const topAppBarHeight = ref(60);

const menuItems: TopAppbarMenuItem[] = [
  { key: 'home', label: 'Home', to: '/' },
  { key: 'about', label: 'About', to: '/about' }
];

const sidebarItems: SidebarItem[] = components.map((component) => {
  const componentName = component.path.replace('/components/', '');
  return {
    key: componentName,
    label: startCase(componentName).replaceAll(/\s/g, ''),
    to: component.path
  };
});

const { state: color, execute: getColor } = useInvoke<string>(Command.RandomHexColor);
</script>

<template>
  <MScaffold
    :sidebar-items="sidebarItems"
    sidebar-item-class="flex items-center justify-center"
    :sidebar-item-style="{ width: topAppBar?.startWidth }"
  >
    <template #top-bar>
      <MTopAppbar
        ref="topAppBar"
        content-alignment="end"
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

    <template #sidebar-item="{ to, label }">
      <MDynamicLink :to="to">
        <span>{{ label }}</span>
      </MDynamicLink>
    </template>

    <template #default>
      <RouterView />
    </template>

    <template #bottom-bar>
      <div class="flex h-16 w-full items-center justify-center">
        <span>Bottom bar</span>
      </div>
    </template>
  </MScaffold>
</template>
