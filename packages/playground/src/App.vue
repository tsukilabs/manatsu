<script setup lang="ts">
import { inject, ref } from 'vue';
import { darkModeKey } from 'manatsu/src/index.ts';
import {
  MButton,
  MInput,
  MNavbar,
  MScaffold
} from '@manatsu/components/index.ts';
import LoremIpsum from './components/LoremIpsum.vue';

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
  <MScaffold navbar>
    <template #navbar>
      <MNavbar />
    </template>

    <main>
      <div class="dark-mode">
        <span>Dark mode: {{ darkMode }}</span>
        <MButton @click="switchDarkMode">Toggle</MButton>
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
  </MScaffold>
</template>

<style scoped lang="scss">
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

.dark-mode {
  @include flex($gap: 1rem);
  align-items: center;
}
</style>
