<script setup lang="ts">
defineProps<{
  paragraphs: number;
}>();
</script>

<template>
  <div class="flex flex-col gap-4">
    <p v-for="p of paragraphs" :key="p">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id eros ultricies, tincidunt
      nibh id, euismod libero. Maecenas eros nisl, porta et pharetra eu, tempus sit amet diam. Morbi
      blandit, tortor et placerat pharetra, libero metus ultrices metus, nec suscipit nulla nisl eu
      neque. Suspendisse enim nisi, commodo a convallis ut, laoreet venenatis nibh. Integer blandit
      sem sit amet massa convallis, non porta ex facilisis. Donec sem nisi, sollicitudin sed
      pellentesque eget, varius nec nisl. Integer feugiat, arcu id vulputate tincidunt, felis magna
      imperdiet odio, ac mattis massa eros quis metus. Praesent ornare a est eu rhoncus. Nulla
      facilisi.
    </p>
  </div>
</template>
