<script setup lang="ts">
import { ref } from 'vue';
import LoremIpsum from '../../components/LoremIpsum.vue';

const visible = ref(false);
const visibleModal = ref(false);
const visibleNoStorage = ref(false);
</script>

<template>
  <div class="flex gap-4">
    <m-button @click="visible = !visible">Show</m-button>
    <m-button @click="visibleModal = !visibleModal">Show modal</m-button>
    <m-button @click="visibleNoStorage = !visibleNoStorage">Show no storage</m-button>

    <m-dialog
      v-model:visible="visible"
      click-outside
      esc
      storage-key="dialog-position"
      storage-type="local"
    >
      <template #header>
        <span>Dialog</span>
      </template>

      <template #default>
        <LoremIpsum class="h-48 w-48" />
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <m-button @click="visible = false">Close</m-button>
          <m-button @click="visible = false">Save</m-button>
        </div>
      </template>
    </m-dialog>

    <m-dialog
      v-model:visible="visibleModal"
      modal
      click-outside
      esc
      header="Modal Dialog"
      storage-key="dialog-modal-position"
      storage-type="local"
    >
      <template #default>
        <LoremIpsum :paragraphs="2" class="h-48 w-48" />
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <m-button @click="visibleModal = false">Close</m-button>
          <m-button @click="visibleModal = false">Save</m-button>
        </div>
      </template>
    </m-dialog>

    <m-dialog v-model:visible="visibleNoStorage" click-outside esc header="No Storage">
      <template #default>
        <LoremIpsum :paragraphs="2" class="h-48 w-48" />
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <m-button @click="visibleNoStorage = false">Close</m-button>
          <m-button @click="visibleNoStorage = false">Save</m-button>
        </div>
      </template>
    </m-dialog>
  </div>
</template>
