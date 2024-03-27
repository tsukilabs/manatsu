<script setup lang="ts">
import { defineEmptyComponent, injectStrict, privateSymbols } from '@manatsu/shared';
import MDialog from './MDialog.vue';

const emit = defineEmits<(e: 'hide' | 'show') => void>();

const visible = injectStrict(privateSymbols.dynDialogVisible);
const dialogProps = injectStrict(privateSymbols.dynDialogOptions);

const defaultSlot = injectStrict(privateSymbols.dynDialogDefault);
const defaultSlotProps = injectStrict(privateSymbols.dynDialogDefaultProps);

const headerSlot = injectStrict(privateSymbols.dynDialogHeader);
const headerSlotProps = injectStrict(privateSymbols.dynDialogHeaderProps);

const footerSlot = injectStrict(privateSymbols.dynDialogFooter);
const footerSlotProps = injectStrict(privateSymbols.dynDialogFooterProps);

const onHideRef = injectStrict(privateSymbols.dynDialogOnHide);
const onShowRef = injectStrict(privateSymbols.dynDialogOnShow);

const emptyComponent = defineEmptyComponent();

function onHide() {
  emit('hide');
  onHideRef.value?.();
}

function onShow() {
  emit('show');
  onShowRef.value?.();
}
</script>

<template>
  <m-dialog
    v-if="visible"
    v-model:visible="visible"
    v-bind="dialogProps"
    @hide="onHide"
    @show="onShow"
  >
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
  <empty-component v-else />
</template>
