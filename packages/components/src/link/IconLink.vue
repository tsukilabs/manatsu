<script setup lang="ts">
import { useToPixel } from '@manatsu/composables/src/index.ts';
import Icon from '../icon/Icon.vue';
import DynamicLink from './DynamicLink.vue';
import type { IconLinkProps } from './types';

const props = withDefaults(defineProps<IconLinkProps>(), {
  height: '36px',
  width: '36px'
});

const height = useToPixel(() => props.height);
const width = useToPixel(() => props.width);
</script>

<template>
  <DynamicLink class="m-icon-link" :style="style" :to="to">
    <Icon :icon="icon" v-bind="iconProps" />
  </DynamicLink>
</template>

<style scoped lang="scss">
@use '../style';

.m-icon-link {
  @include style.flex-center;
  width: v-bind('width');
  height: v-bind('height');
}
</style>
