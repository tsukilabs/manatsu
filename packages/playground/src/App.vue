<script setup lang="ts">
import {
  type IconLinkProps,
  MNavbar,
  MScaffold
} from '@manatsu/components/src/index.ts';
import peach from '/peach.png';

const socialLinks: IconLinkProps[] = [
  { icon: 'github', to: 'https://github.com/manatsujs/manatsu' },
  { icon: 'facebook', to: 'https://example.com/1' },
  { icon: 'discord', to: 'https://example.com/2' },
  { icon: 'instagram', to: 'https://example.com/3' },
  { icon: 'x', to: 'https://example.com/4' }
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
      />
    </template>

    <RouterView />
  </MScaffold>
</template>
