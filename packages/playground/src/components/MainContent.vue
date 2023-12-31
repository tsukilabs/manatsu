<script setup lang="ts">
import { inject, ref } from 'vue';
import { darkModeKey } from 'manatsu/src/index.ts';
import { MButton, MInput } from '@manatsu/components/src/index.ts';
import LoremIpsum from './LoremIpsum.vue';

const darkMode = inject(darkModeKey, () => ref<boolean | 'auto'>(false), true);

const inputRef = ref<string | null>(null);

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
      <MButton @click="switchDarkMode">Toggle</MButton>
    </div>
    <div>
      <MButton>Button</MButton>
      <MButton outlined>Outlined</MButton>
      <MButton>Lorem ipsum dolor</MButton>
    </div>
    <div>
      <MInput v-model="inputRef" placeholder="Text field" />
      <p>{{ inputRef }}</p>
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

.dark-mode {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
