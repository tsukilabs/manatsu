<script setup lang="ts">
import { inject, ref } from 'vue';
import { darkModeKey } from 'manatsu/src/index.ts';
import { MButton, MInput } from '@manatsu/components/index.ts';

const darkMode = inject(darkModeKey, () => ref<boolean | 'auto'>(false), true);

function switchDarkMode() {
  if (darkMode.value === 'auto') {
    darkMode.value = false;
  } else {
    darkMode.value = !darkMode.value;
  }
}
</script>

<template>
  <main>
    <div class="dark-mode">
      <span>Dark mode: {{ darkMode }}</span>
      <MButton filled @click="switchDarkMode">Elevated</MButton>
    </div>
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
  @include flex($flex-direction: column, $gap: 1rem);
}

main > div {
  @include flex($gap: 1rem);
}
</style>
