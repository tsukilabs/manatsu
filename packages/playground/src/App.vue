<script setup lang="ts">
import { useRoute } from 'vue-router';
import { startCase } from 'lodash-es';
import { useLocalStorage } from '@vueuse/core';
import { symbols } from 'manatsu/src/index.ts';
import { inject, shallowRef, watchEffect } from 'vue';
import type { SidebarItem, TopAppbarMenuItem } from '@manatsu/components/src/index.ts';
import { components } from './routes';
import { StorageKey, useInvoke } from './utils';

const route = useRoute();
const lastRoute = useLocalStorage(StorageKey.LastRoute, '/');
watchEffect(() => (lastRoute.value = route.path));

const darkMode = inject(symbols.darkMode);

type TopBar = typeof import('@manatsu/components/src/appbar/index.ts').MTopAppbar;
const topBarRef = shallowRef<InstanceType<TopBar> | null>(null);

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

const { state: color, execute: getColor } = useInvoke<string>('RandomHexColor');
</script>

<template>
  <m-scaffold
    :sidebar-items
    sidebar-item-class="flex items-center justify-center"
    :sidebar-item-style="{ width: `${topBarRef?.startWidth ?? 0}px` }"
  >
    <template #top>
      <m-top-appbar
        ref="topBarRef"
        content-alignment="end"
        :menu-items
        :height="60"
        logo="/peach.png"
        title="Manatsu"
        title-link="/"
      >
        <template #menu-item="{ label, to }">
          <!-- eslint-disable-next-line vue/v-bind-style -->
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
      <!-- eslint-disable-next-line vue/v-bind-style -->
      <m-dynamic-link :to="to">
        <span>{{ label }}</span>
      </m-dynamic-link>
    </template>

    <template #default>
      <router-view #default="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </template>

    <template #bottom>
      <div class="flex h-16 w-full items-center justify-center">
        <span>Scaffold bottom</span>
      </div>
    </template>
  </m-scaffold>
</template>
./utils
