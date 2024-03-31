<script setup lang="ts">
import { computed } from 'vue';
import { isEmpty } from '@tb-dev/utils';
import type { SelectLabelProps } from './types';
import MEllipsis from '../ellipsis/MEllipsis.vue';

const model = defineModel<any>({ required: true });

const props = defineProps<SelectLabelProps>();

const label = computed(() => {
  if (isEmpty(model.value)) return props.placeholder;
  if (Array.isArray(model.value)) return model.value.map(props.transform).join(', ');
  return props.transform(model.value);
});
</script>

<template>
  <m-ellipsis>{{ label }}</m-ellipsis>
</template>
