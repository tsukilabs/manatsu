<script setup lang="ts">
import { computed, ref } from 'vue';
import { MCard, MCheckbox } from '@manatsu/components/src/index.ts';

const first = ref('yes');
const second = ref(0);
const third = ref(false);

const singleValues = computed(() => {
  const values = {
    first: first.value,
    second: second.value,
    third: third.value
  };

  return JSON.stringify(values, null, 2);
});

const group = ref([]);
</script>

<template>
  <div class="flex gap-4">
    <MCard variant="outlined" title="Single" class="w-max" header-style="padding-bottom: 0;">
      <div class="flex flex-col gap-4">
        <pre>{{ singleValues }}</pre>

        <div class="flex gap-4">
          <MCheckbox v-model="first" true-value="yes" false-value="no">Label 1</MCheckbox>
          <MCheckbox v-model="second" :true-value="1" :false-value="0">Label 2</MCheckbox>
          <MCheckbox v-model="third">Label 3</MCheckbox>
        </div>
      </div>
    </MCard>

    <MCard variant="outlined" title="Group" class="w-max" header-style="padding-bottom: 0;">
      <div class="flex flex-col gap-4">
        <pre>{{ JSON.stringify(group, null, 2) }}</pre>

        <div class="flex gap-4">
          <MCheckbox v-model="group" value="label 1">Label 1</MCheckbox>
          <MCheckbox v-model="group" :value="2">Label 2</MCheckbox>
          <MCheckbox v-model="group" :value="{ label: '3' }">Label 3</MCheckbox>
        </div>
      </div>
    </MCard>
  </div>
</template>
