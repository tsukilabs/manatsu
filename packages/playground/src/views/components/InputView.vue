<script setup lang="ts">
import { ref } from 'vue';
import { MInput } from '@manatsu/components/src/index.ts';

const inputValue = ref<string | null>(null);
</script>

<template>
  <div>
    <MInput v-model:value="inputValue" placeholder="Text field" />
  </div>
</template>
