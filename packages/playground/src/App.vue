<script setup lang="ts">
import { MNavbar, MScaffold } from '@manatsu/components/index.ts';
import peach from '/peach.png';
import MainContent from './components/MainContent.vue';
</script>

<template>
  <MScaffold navbar>
    <template #navbar>
      <MNavbar title="Title" :logo="peach" />
    </template>

    <MainContent />
  </MScaffold>
</template>
