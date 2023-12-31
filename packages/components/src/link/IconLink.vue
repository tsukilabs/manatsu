<script setup lang="ts">
import { useToPixel } from '@manatsu/composables/src/index.ts';
import { type CSSProperties, type ComputedRef, toRef } from 'vue';
import Icon from '../icon/Icon.vue';
import DynamicLink from './DynamicLink.vue';
import type { IconLinkProps } from './types';

const props = withDefaults(defineProps<IconLinkProps>(), {
  height: 36,
  width: 36
});

const style: ComputedRef<CSSProperties> = useToPixel({
  height: toRef(() => props.height),
  width: toRef(() => props.width)
});
</script>

<template>
  <DynamicLink class="m-icon-link" :style="style" :to="to">
    <Icon :icon="icon" v-bind="iconProps" />
  </DynamicLink>
</template>

<style scoped lang="scss">
.m-icon-link {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
