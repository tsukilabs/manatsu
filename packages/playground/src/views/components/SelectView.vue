<script setup lang="ts">
import type { SelectOption } from '@manatsu/components/src/index.ts';

const value1 = ref<string | null>(null);
const options1 = shallowRef<SelectOption[]>(generateOptions(5, false, true));

const value2 = ref<string | null>(null);
const options2 = shallowRef<SelectOption[]>(generateOptions(100));

const value3 = ref<string | null>(null);
const options3 = shallowRef<SelectOption[]>(generateOptions(30, true));

function generateOptions(amount: number, long = false, object = false) {
  const array: any[] = [];

  for (let i = 0; i < amount; i++) {
    let text: string;
    if (long) {
      text = `Option ${i + 1} with a long text that will overflow the container`;
    } else {
      text = `Option ${i + 1}`;
    }

    if (object) {
      array.push({ test: text });
    } else {
      array.push(text);
    }
  }

  return array.map<SelectOption>((value) => ({ key: value, value }));
}
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <div class="flex w-56 flex-col gap-2">
      <div>{{ value1 }}</div>
      <div>
        <m-select
          v-model="value1"
          :options="options1"
          multiple
          placeholder="Select a value"
          :transform="({ test }) => test"
          class="w-56"
        />
      </div>
    </div>
    <div class="flex w-56 flex-col gap-2">
      <div>{{ value2 }}</div>
      <div>
        <m-select
          v-model="value2"
          :options="options2"
          multiple
          :chips="false"
          :hide-on-window-blur="false"
          :transform="(value: string) => value.toUpperCase()"
          placeholder="Select a value"
          class="w-56"
        />
      </div>
    </div>
    <div class="flex w-56 flex-col gap-2">
      <div>{{ value3 }}</div>
      <div>
        <m-select v-model="value3" :options="options3" :hide-on-window-blur="false" class="w-56" />
      </div>
    </div>
    <div class="flex w-56 flex-col gap-2">
      <div>Disabled</div>
      <div>
        <m-select
          v-model="value1"
          :options="options1"
          placeholder="Select a value"
          :transform="({ test }) => test"
          class="w-56"
          disabled
        />
      </div>
    </div>
  </div>
</template>
