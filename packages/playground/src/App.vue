<script setup lang="ts">
import { h } from 'vue';
import {
  Discord,
  Facebook,
  GitHub,
  Instagram,
  Twitter
} from '@manatsu/icons/src/index.ts';
import {
  type IconLinkProps,
  MNavbar,
  MScaffold,
  type NavbarMenuItem
} from '@manatsu/components/src/index.ts';
import peach from '/peach.png';

const socialLinks: IconLinkProps[] = [
  { icon: () => h(GitHub), to: 'https://github.com/manatsujs/manatsu' },
  { icon: () => h(Discord), to: 'https://example.com/1' },
  { icon: () => h(Facebook), to: 'https://example.com/2' },
  { icon: () => h(Instagram), to: 'https://example.com/3' },
  { icon: () => h(Twitter), to: 'https://example.com/4' }
];

const menuItems: NavbarMenuItem[] = [
  { key: 'first', label: () => h('div', 'First item') },
  { key: 'second', label: 'Second item', to: 'https://example.com' }
];
</script>

<template>
  <MScaffold navbar>
    <template #navbar>
      <MNavbar
        title="Title"
        title-link="/"
        :logo="peach"
        :social-links="socialLinks"
        :menu-items="menuItems"
      />
    </template>

    <RouterView />
  </MScaffold>
</template>
