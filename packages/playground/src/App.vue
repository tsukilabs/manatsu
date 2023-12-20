<script setup lang="ts">
import { MNavbar, MScaffold } from '@manatsu/components/index.ts';
import MainContent from './components/MainContent.vue';
</script>

<template>
  <MScaffold navbar>
    <template #navbar>
      <MNavbar title="olá" />
    </template>

    <MainContent />
  </MScaffold>
</template>
