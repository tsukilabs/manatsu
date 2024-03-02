<script setup lang="ts">
import { ref } from 'vue';

const inputValue = ref<string | null>(null);
</script>

<template>
  <div>
    <m-input-text v-model:value="inputValue" placeholder="Text field" />
  </div>
</template>
