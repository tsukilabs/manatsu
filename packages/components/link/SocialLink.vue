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
  <DynamicLink :to="to" class="m-social-link">
    <SocialLinkIcon class="m-social-link-icon" />
  </DynamicLink>
</template>

<style scoped lang="scss">
:global(:root) {
  --m-social-link-size: 36px;
  --m-social-link-icon-size: 20px;
}

.m-social-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--m-social-link-size);
  height: var(--m-social-link-size);
}

.m-social-link-icon {
  width: var(--m-social-link-icon-size);
  height: var(--m-social-link-icon-size);
}

.m-social-link-icon > :deep(svg) {
  fill: currentColor;
}
</style>
