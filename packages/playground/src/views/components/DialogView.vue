<script setup lang="ts">
import { MButton } from 'manatsu/src/index.ts';
import { useDialog } from '@manatsu/composables/src/index.ts';
import LoremIpsum from '../../components/LoremIpsum.vue';

const visible = ref(false);
const visibleModal = ref(false);
const visibleNoStorage = ref(false);
const visibleInput = ref(false);

const dialog1 = useDialog({
  closeOnClickOutside: true,
  closeOnEsc: true,
  dialogClass: 'w-96 h-60',
  storageKey: 'dyn-dialog-1'
});

const dialog2 = useDialog({
  closeOnClickOutside: true,
  closeOnEsc: true,
  dialogClass: 'w-96 h-60',
  storageKey: 'dyn-dialog-2'
});

const showDialog1 = showDialog(1);
const showDialog2 = showDialog(2);

function showDialog(id: number) {
  return function () {
    const dialog = id === 1 ? dialog1 : dialog2;
    dialog.header(() => h('span', `Dynamic Dialog ${id}`));
    dialog.content(() => h(LoremIpsum, { paragraphs: 2 }));
    dialog.footer(() =>
      h('div', { class: 'flex justify-end gap-2' }, () => [
        h(MButton, { onClick: () => dialog.close() }, 'Close'),
        h(MButton, { variant: 'outlined' }, `Dialog ${id}`)
      ])
    );

    dialog.on('show', () => console.log(`showing dynamic dialog ${id}`));
    dialog.on('hide', () => console.log(`hiding dynamic dialog ${id}`));

    dialog.show();
  };
}
</script>

<template>
  <div class="flex gap-4">
    <m-button @click="visible = !visible">Show</m-button>
    <m-button @click="visibleModal = !visibleModal">Show modal</m-button>
    <m-button @click="visibleNoStorage = !visibleNoStorage">Show no storage</m-button>
    <m-button @click="visibleInput = !visibleInput">Show input</m-button>

    <m-button @click="showDialog1">Show dynamic 1</m-button>
    <m-button @click="showDialog2">Show dynamic 2</m-button>

    <m-dialog
      v-model:visible="visible"
      close-on-click-outside
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
      close-on-click-outside
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

    <m-dialog v-model:visible="visibleNoStorage" close-on-click-outside header="No Storage">
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

    <m-dialog v-model:visible="visibleInput" close-on-click-outside>
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
