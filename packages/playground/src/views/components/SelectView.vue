<script setup lang="ts">
import type { SelectOption } from '@manatsu/components/src/index.ts';

const value1 = ref<string | null>(null);
const options1 = ref<SelectOption[]>(generateOptions(5));

const value2 = ref<string | null>(null);
const options2 = ref<SelectOption[]>(generateOptions(100));

const value3 = ref<string | null>(null);
const options3 = ref<SelectOption[]>(generateOptions(30, true));

function generateOptions(amount: number, long = false) {
  const array: string[] = [];

  for (let i = 0; i < amount; i++) {
    if (long) {
      array.push(`Option ${i + 1} with a long text that will overflow the container`);
    } else {
      array.push(`Option ${i + 1}`);
    }
  }

  return array.map<SelectOption>((value) => ({ key: value, value }));
}
</script>

<template>
  <div class="flex gap-4">
    <div class="flex flex-col gap-2">
      <div>{{ value1 }}</div>
      <div>
        <m-select
          v-model="value1"
          :options="options1"
          multiple
          placeholder="Select a value"
          class="w-56"
        />
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div>{{ value2 }}</div>
      <div>
        <m-select
          v-model="value2"
          :options="options2"
          :hide-on-window-blur="false"
          :transform="(value: string) => value.toUpperCase()"
          placeholder="Select a value"
          class="w-56"
        />
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div>{{ value3 }}</div>
      <div>
        <m-select v-model="value3" :options="options3" placeholder="Select a value" class="w-56" />
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div>Disabled</div>
      <div>
        <m-select
          v-model="value1"
          :options="options1"
          placeholder="Select a value"
          class="w-56"
          disabled
        />
      </div>
    </div>
  </div>
</template>
