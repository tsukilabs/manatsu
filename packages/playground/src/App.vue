<script setup lang="ts">
import { MButton, MInput } from '@manatsu/components/index.ts';
</script>

<template>
  <main>
    <div>
      <MButton elevated>Elevated</MButton>
      <MButton filled>Filled</MButton>
      <MButton tonal>Tonal</MButton>
      <MButton outlined>Outlined</MButton>
      <MButton text>Text</MButton>
    </div>
    <div>
      <MInput filled />
      <MInput outlined />
    </div>
  </main>
</template>

<style lang="scss">
@mixin flex($flex-direction: row, $gap: 1rem) {
  display: flex;
  flex-direction: $flex-direction;
  gap: $gap;
}

main {
  @include flex($flex-direction: column, $gap: 2rem);
}

main > div:first-child {
  @include flex($gap: 1rem);
}

main > div:nth-child(2) {
  @include flex($flex-direction: column);
}
</style>
