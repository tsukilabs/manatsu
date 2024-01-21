<script setup lang="ts">
import { ref } from 'vue';

const inputValue = ref<string | null>(null);
</script>

<template>
  <div>
    <MInput v-model:value="inputValue" placeholder="Text field" />
  </div>
</template>
