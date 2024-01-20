<script setup lang="ts">
import { ref } from 'vue';
import { MCheckbox } from '@manatsu/components/src/index.ts';

const checkboxValue = ref(false);
</script>

<template>
  <div class="flex gap-4">
    <MCheckbox v-model:checked="checkboxValue">Label</MCheckbox>
    <MCheckbox v-model:checked="checkboxValue" disabled>Disabled</MCheckbox>
  </div>
</template>
