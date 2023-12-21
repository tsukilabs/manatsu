<script setup lang="ts">
import { defineComponent, h } from 'vue';
import Icon from '../icon/Icon.vue';
import DynamicLink from './DynamicLink.vue';
import type { SocialLinkProps } from './types';

const props = defineProps<SocialLinkProps>();

const SocialLinkIcon = defineComponent(() => {
  return () => {
    if (typeof props.icon === 'function') {
      return props.icon;
    }

    return h(Icon, { icon: props.icon });
  };
});
</script>

<template>
  <DynamicLink :to="to">
    <SocialLinkIcon />
  </DynamicLink>
</template>

<style scoped lang="scss"></style>
