<script setup lang="ts">
import { GitHub } from '@manatsu/icons/src/index.ts';
import { MButton, MIcon, MInput } from '@manatsu/components/src/index.ts';
import LoremIpsum from './LoremIpsum.vue';
</script>

<template>
  <main>
    <div>
      <MIcon :component="GitHub" />
      <MIcon><GitHub /></MIcon>
      <MIcon :component="GitHub"><GitHub /></MIcon>
    </div>
    <div>
      <MButton>Button</MButton>
      <MButton outlined>Outlined</MButton>
      <MButton>Lorem ipsum dolor</MButton>
    </div>
    <div>
      <MInput placeholder="Text field" />
    </div>
    <LoremIpsum :paragraphs="3" />
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

main > div {
  display: flex;
  gap: 1rem;
}
</style>
