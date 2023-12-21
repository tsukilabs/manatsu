<script setup lang="ts">
import { reactive } from 'vue';
import {
  MNavbar,
  MScaffold,
  type SocialLinkProps
} from '@manatsu/components/index.ts';
import peach from '/peach.png';
import MainContent from './components/MainContent.vue';

const socialLinks = reactive<SocialLinkProps[]>([
  { icon: 'github', to: 'https://github.com/manatsujs/manatsu' }
]);
</script>

<template>
  <MScaffold navbar>
    <template #navbar>
      <MNavbar title="Title" :logo="peach" :social-links="socialLinks" />
    </template>

    <MainContent />
  </MScaffold>
</template>
