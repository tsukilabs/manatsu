<script setup lang="ts">
import { useStore } from '../stores';

const store = useStore();
const { logs } = storeToRefs(store);
</script>

<template>
  <div class="flex flex-col gap-4">
    <pre v-for="(log, idx) of logs" :key="idx">{{ log }}</pre>
  </div>
</template>
