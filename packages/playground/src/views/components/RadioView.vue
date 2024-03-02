<script setup lang="ts">
import { ref } from 'vue';

const group = ref<string>('label 1');
</script>

<template>
  <div class="flex gap-4">
    <m-card variant="outlined" title="Group" class="w-max" header-style="padding-bottom: 0;">
      <div class="flex flex-col gap-4">
        <pre>{{ group }}</pre>

        <div class="flex gap-4">
          <m-radio v-model="group" name="radio" value="label 1">Label 1</m-radio>
          <m-radio v-model="group" name="radio" value="label 2">Label 2</m-radio>
          <m-radio v-model="group" name="radio" value="label 3">Label 3</m-radio>
          <m-radio v-model="group" name="radio" value="label 4">Label 4</m-radio>
          <m-radio v-model="group" name="radio" value="label 5">Label 5</m-radio>
          <m-radio v-model="group" value="label 5" disabled>Disabled</m-radio>
        </div>
      </div>
    </m-card>
  </div>
</template>
