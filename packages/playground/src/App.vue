<script setup lang="ts">
import {
  MNavbar,
  MScaffold,
  type SocialLinkProps
} from '@manatsu/components/index.ts';
import peach from '/peach.png';
import MainContent from './components/MainContent.vue';

const socialLinks: SocialLinkProps[] = [
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
      <MNavbar title="Title" :logo="peach" :social-links="socialLinks" />
    </template>

    <MainContent />
  </MScaffold>
</template>
