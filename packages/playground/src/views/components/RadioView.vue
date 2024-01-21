<script setup lang="ts">
import { ref } from 'vue';
import { MRadio } from '@manatsu/components/src/index.ts';

const radioValue = ref<string>('label 1');
</script>

<template>
  <div class="flex gap-4">
    <MRadio v-model="radioValue" name="radio" value="label 1">Label 1</MRadio>
    <MRadio v-model="radioValue" name="radio" value="label 2">Label 2</MRadio>
    <MRadio v-model="radioValue" name="radio" value="label 3">Label 3</MRadio>
    <MRadio v-model="radioValue" name="radio" value="label 4">Label 4</MRadio>
    <MRadio v-model="radioValue" name="radio" value="label 5">Label 5</MRadio>
    <MRadio v-model="radioValue" value="label 5" disabled>Disabled</MRadio>
  </div>
</template>
