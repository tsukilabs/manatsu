<script setup lang="ts">
import { type VNode, defineComponent, h } from 'vue';
import { type RouteLocationRaw, RouterLink } from 'vue-router';
import { useExternalLink } from '@manatsu/composables/src/index.ts';

const slots = defineSlots<{ default?: () => VNode }>();

const to = defineModel<RouteLocationRaw>('to');
const isExternalLink = useExternalLink(to);

const LinkComponent = defineComponent(() => {
  if (!to.value) return () => h('span', null, slots.default?.());
  if (typeof to.value === 'string' && isExternalLink.value) {
    const aProps = { target: '_blank', rel: '"noopener noreferrer' };
    return () => h('a', { href: to.value, ...aProps }, slots.default?.());
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return () => h(RouterLink, { to: to.value! }, slots.default?.());
});

defineExpose({ isExternalLink });
</script>

<template>
  <component :is="LinkComponent" />
</template>
