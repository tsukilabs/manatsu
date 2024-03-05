<script setup lang="ts">
import { ref } from 'vue';

const first = ref<string>('manatsu');
const second = ref<string | null>(null);
</script>

<template>
  <div class="flex gap-4">
    <div class="flex w-40 flex-col gap-2">
      <m-input-text v-model="first" placeholder="Text field" />
      <span> {{ first }} </span>
    </div>
    <div class="flex w-40 flex-col gap-2">
      <m-input-text v-model="second" placeholder="Text field" />
      <span> {{ second }} </span>
    </div>
  </div>
</template>
