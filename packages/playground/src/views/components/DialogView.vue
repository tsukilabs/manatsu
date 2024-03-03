<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
const visibleWithModal = ref(false);
</script>

<template>
  <div class="flex gap-4">
    <m-button @click="visible = !visible">Show</m-button>
    <m-button @click="visibleWithModal = !visibleWithModal">Show with modal</m-button>

    <m-dialog
      v-model:visible="visible"
      close-on-esc
      close-on-click-outside
      position-storage-key="dialog-position"
      position-storage-type="local"
    >
      <div>Dialog</div>
    </m-dialog>

    <m-dialog
      v-model:visible="visibleWithModal"
      modal
      close-on-esc
      close-on-click-outside
      position-storage-key="dialog-modal-position"
      position-storage-type="local"
    >
      <div>Dialog with modal</div>
    </m-dialog>
  </div>
</template>
