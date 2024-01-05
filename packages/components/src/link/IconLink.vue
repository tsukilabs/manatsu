<script setup lang="ts">
import type { VNode } from 'vue';
import { useToPixel } from '@manatsu/composables/src/index.ts';
import Icon from '../icon/Icon.vue';
import DynamicLink from './DynamicLink.vue';
import type { IconLinkProps } from './types';

const props = withDefaults(defineProps<IconLinkProps>(), {
  height: '36px',
  width: '36px'
});

defineSlots<{ default: () => VNode }>();

const height = useToPixel(() => props.height);
const width = useToPixel(() => props.width);
</script>

<template>
  <DynamicLink class="m-icon-link" :style="style" :to="to">
    <Icon v-bind="iconProps">
      <slot></slot>
    </Icon>
  </DynamicLink>
</template>

<style scoped lang="scss">
@use '@manatsu/sass/flex';

.m-icon-link {
  @include flex.center;
  width: v-bind('width');
  height: v-bind('height');
}
</style>
