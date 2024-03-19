<script setup lang="ts">
import { inject, isRef, ref } from 'vue';
import { privateSymbols } from '@manatsu/shared';
import MDialog from './MDialog.vue';

const emit = defineEmits<(e: 'hide' | 'show') => void>();

const visible = inject(privateSymbols.dynDialogVisible, () => ref(false), true);
const dialogProps = inject(privateSymbols.dynDialogOptions);

const defaultSlot = inject(privateSymbols.dynDialogDefault);
const defaultSlotProps = inject(privateSymbols.dynDialogDefaultProps);

const headerSlot = inject(privateSymbols.dynDialogHeader);
const headerSlotProps = inject(privateSymbols.dynDialogHeaderProps);

const footerSlot = inject(privateSymbols.dynDialogFooter);
const footerSlotProps = inject(privateSymbols.dynDialogFooterProps);

const onHideRef = inject(privateSymbols.dynDialogOnHide);
const onShowRef = inject(privateSymbols.dynDialogOnShow);

function onHide() {
  emit('hide');
  if (isRef(onHideRef)) {
    onHideRef.value?.();
  }
}

function onShow() {
  emit('show');
  if (isRef(onShowRef)) {
    onShowRef.value?.();
  }
}
</script>

<template>
  <m-dialog v-model:visible="visible" v-bind="dialogProps" @hide="onHide" @show="onShow">
    <template v-if="headerSlot" #header>
      <component :is="headerSlot" v-bind="headerSlotProps" />
    </template>

    <template v-if="defaultSlot" #default>
      <component :is="defaultSlot" v-bind="defaultSlotProps" />
    </template>

    <template v-if="footerSlot" #footer>
      <component :is="footerSlot" v-bind="footerSlotProps" />
    </template>
  </m-dialog>
</template>
