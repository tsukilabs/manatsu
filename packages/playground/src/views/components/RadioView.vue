<script setup lang="ts">
import { ref } from 'vue';
import { MCard, MRadio } from '@manatsu/components/src/index.ts';

const group = ref<string>('label 1');
</script>

<template>
  <div class="flex gap-4">
    <MCard variant="outlined" title="Group" class="w-max" header-style="padding-bottom: 0;">
      <div class="flex flex-col gap-4">
        <pre>{{ group }}</pre>

        <div class="flex gap-4">
          <MRadio v-model="group" name="radio" value="label 1">Label 1</MRadio>
          <MRadio v-model="group" name="radio" value="label 2">Label 2</MRadio>
          <MRadio v-model="group" name="radio" value="label 3">Label 3</MRadio>
          <MRadio v-model="group" name="radio" value="label 4">Label 4</MRadio>
          <MRadio v-model="group" name="radio" value="label 5">Label 5</MRadio>
          <MRadio v-model="group" value="label 5" disabled>Disabled</MRadio>
        </div>
      </div>
    </MCard>
  </div>
</template>
