<script setup lang="ts">
import { h, ref } from 'vue';
import { useDialog } from '@manatsu/composables/src/index.ts';
import LoremIpsum from '../../components/LoremIpsum.vue';

const visible = ref(false);
const visibleModal = ref(false);
const visibleNoStorage = ref(false);
const visibleInput = ref(false);

const dialog = useDialog({
  clickOutside: false,
  dialogClass: 'w-96 h-60'
});

function showDialog() {
  dialog.setHeader(() => h('span', 'Dynamic Dialog'));
  dialog.setContent(() => h(LoremIpsum, { paragraphs: 2 }));
  dialog.setFooter(() =>
    h('div', { class: 'flex justify-end gap-2' }, [
      h('button', { onClick: () => dialog.close() }, 'Close'),
      h('button', { onClick: () => dialog.reset() }, 'Reset')
    ])
  );

  const interval = setInterval(() => {
    dialog.setHeader(() => h('span', new Date().toLocaleTimeString()));
  }, 100);

  dialog.on('show', () => console.log('showing dynamic dialog'));
  dialog.on('hide', () => {
    clearInterval(interval);
    console.log('hiding dynamic dialog');
  });

  dialog.show();
}
</script>

<template>
  <div class="flex gap-4">
    <m-button @click="visible = !visible">Show</m-button>
    <m-button @click="visibleModal = !visibleModal">Show modal</m-button>
    <m-button @click="visibleNoStorage = !visibleNoStorage">Show no storage</m-button>
    <m-button @click="visibleInput = !visibleInput">Show input</m-button>

    <m-button @click="showDialog">Show dynamic</m-button>

    <m-dialog
      v-model:visible="visible"
      click-outside
      storage-key="dialog-position"
      storage-type="local"
    >
      <template #header>
        <span>Dialog</span>
      </template>

      <template #default>
        <lorem-ipsum class="h-48 w-48" />
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
      header="Modal Dialog"
      storage-key="dialog-modal-position"
      storage-type="local"
    >
      <template #default>
        <lorem-ipsum :paragraphs="2" class="h-48 w-48" />
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <m-button @click="visibleModal = false">Close</m-button>
          <m-button @click="visibleModal = false">Save</m-button>
        </div>
      </template>
    </m-dialog>

    <m-dialog v-model:visible="visibleNoStorage" click-outside header="No Storage">
      <template #default>
        <lorem-ipsum :paragraphs="2" class="h-48 w-48" />
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <m-button @click="visibleNoStorage = false">Close</m-button>
          <m-button @click="visibleNoStorage = false">Save</m-button>
        </div>
      </template>
    </m-dialog>

    <m-dialog v-model:visible="visibleInput" click-outside>
      <template #default>
        <div class="flex flex-col gap-4">
          <m-input-text v-for="i of 5" :key="i" />
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <m-button @click="visibleInput = false">Close</m-button>
          <m-button @click="visibleInput = false">Save</m-button>
        </div>
      </template>
    </m-dialog>
  </div>
</template>
