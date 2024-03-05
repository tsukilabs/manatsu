import { Command } from '@manatsu/tauri-plugin/src/index.ts';
import { defineInvoke } from '@manatsu/composables/src/index.ts';

export const useInvoke = defineInvoke({
  ...Command,
  copyright: 'copyright'
});

export enum StorageKey {
  LastRoute = 'playground:last-route'
}
