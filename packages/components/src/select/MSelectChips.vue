<script setup lang="ts">
import { isEmpty } from '@tb-dev/utils';
import MChip from '../chip/MChip.vue';
import type { SelectChipsProps } from './types';
import MEllipsis from '../ellipsis/MEllipsis.vue';

const model = defineModel<any>({ required: true });

defineProps<SelectChipsProps>();

function remove(index: number) {
  if (Array.isArray(model.value)) {
    model.value.splice(index, 1);
  }
}
</script>

<template>
  <div class="m-select-chips">
    <m-ellipsis v-if="isEmpty(model)">{{ placeholder }}</m-ellipsis>
    <template v-else>
      <m-chip
        v-for="(value, index) of model"
        :key="value"
        variant="outlined"
        removable
        @remove="() => remove(index)"
      >
        {{ transform(value) }}
      </m-chip>
    </template>
  </div>
</template>

<style lang="scss">
@use '@manatsu/style/mixins/flex';

.m-select-chips {
  @include flex.x-start-y-center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
