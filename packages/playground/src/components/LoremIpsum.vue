<script setup lang="ts">
defineProps<{
  paragraphs: 1 | 2 | 3;
}>();
</script>

<template>
  <div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id eros ultricies, tincidunt
    nibh id, euismod libero. Maecenas eros nisl, porta et pharetra eu, tempus sit amet diam. Morbi
    blandit, tortor et placerat pharetra, libero metus ultrices metus, nec suscipit nulla nisl eu
    neque. Suspendisse enim nisi, commodo a convallis ut, laoreet venenatis nibh. Integer blandit
    sem sit amet massa convallis, non porta ex facilisis. Donec sem nisi, sollicitudin sed
    pellentesque eget, varius nec nisl. Integer feugiat, arcu id vulputate tincidunt, felis magna
    imperdiet odio, ac mattis massa eros quis metus. Praesent ornare a est eu rhoncus. Nulla
    facilisi.
  </div>

  <div v-if="paragraphs >= 2">
    Maecenas tristique, odio bibendum venenatis consequat, lectus dolor tempus est, egestas cursus
    augue lectus id magna. Vestibulum libero lectus, ullamcorper sed mauris id, auctor consequat
    neque. Sed placerat suscipit mi, vitae gravida ipsum rhoncus quis. Proin vulputate leo et urna
    condimentum iaculis. Vivamus pulvinar mi in ligula congue, vel molestie arcu finibus. Morbi
    ultricies eros non elementum iaculis. Nunc sit amet facilisis neque. Etiam sodales diam id ante
    rutrum aliquet. Maecenas blandit pulvinar nisi ut iaculis. Vivamus id metus diam.
  </div>

  <div v-if="paragraphs >= 3">
    Aenean urna sapien, cursus id condimentum at, egestas ac ipsum. Sed egestas vitae lectus in
    placerat. Nunc eu eros nec diam vehicula tempor. Maecenas pharetra semper enim, eget semper urna
    bibendum ac. Maecenas sed aliquet risus. Donec dolor ligula, suscipit sit amet posuere vitae,
    euismod at eros. Mauris nec mollis metus, sed porta mi. Aliquam vehicula vehicula tortor, vel
    mattis eros fermentum in. Sed nec consequat magna. Morbi luctus euismod felis at imperdiet.
    Integer ex nulla, congue at ullamcorper ac, facilisis sit amet nulla. Sed nec turpis lacus.
  </div>
</template>
