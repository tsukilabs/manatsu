<script setup lang="ts">
import { ref } from 'vue';
import MDialog from './MDialog.vue';

const visible = ref(false);
</script>

<template>
  <m-dialog v-model:visible="visible" />
</template>
