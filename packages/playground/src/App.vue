<script setup lang="ts">
import { useRoute } from 'vue-router';
import { startCase } from 'lodash-es';
import { useLocalStorage } from '@vueuse/core';
import { ref, shallowRef, watchEffect } from 'vue';
import { Command } from '@manatsu/tauri-plugin/src/index.ts';
import { useDarkMode, useInvoke } from '@manatsu/composables/src/index.ts';
import type { SidebarItem, TopAppbarMenuItem } from '@manatsu/components/src/index.ts';
import { StorageKey } from './enum';
import { components } from './routes';

const route = useRoute();
const lastRoute = useLocalStorage(StorageKey.LastRoute, '/');
watchEffect(() => (lastRoute.value = route.path));

const darkMode = useDarkMode();

type TopBar = InstanceType<typeof import('@manatsu/components/src/index.ts').MTopAppbar>;
const topAppBar = shallowRef<TopBar | null>(null);
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
  <m-scaffold
    :sidebar-items="sidebarItems"
    sidebar-item-class="flex items-center justify-center"
    :sidebar-item-style="{ width: topAppBar?.startWidth }"
  >
    <template #top-bar>
      <m-top-appbar
        ref="topAppBar"
        content-alignment="end"
        :menu-items="menuItems"
        :height="topAppBarHeight"
        logo="/peach.png"
        title="Manatsu"
        title-link="/"
      >
        <template #menu-item="{ label, to }">
          <m-dynamic-link :to="to">{{ label }}</m-dynamic-link>
        </template>

        <template #end>
          <div class="flex gap-2">
            <m-button variant="outlined" @click="$mana.toggleDarkMode()">
              {{ darkMode ? 'Light' : 'Dark' }}
            </m-button>
            <m-button
              variant="outlined"
              class="transition-none"
              :style="{ color }"
              @click="getColor"
            >
              {{ color }}
            </m-button>
          </div>
        </template>
      </m-top-appbar>
    </template>

    <template #sidebar-item="{ to, label }">
      <m-dynamic-link :to="to">
        <span>{{ label }}</span>
      </m-dynamic-link>
    </template>

    <template #default>
      <router-view />
    </template>

    <template #bottom-bar>
      <div class="flex h-16 w-full items-center justify-center">
        <span>Bottom bar</span>
      </div>
    </template>
  </m-scaffold>
</template>
