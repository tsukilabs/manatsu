import { defineStore } from 'pinia';
import type { ErrorLog } from '@manatsu/shared';
import { useInvoke } from 'manatsu/src/index.ts';
import { Command } from '@manatsu/tauri-plugin/src/index.ts';

export const useStore = defineStore('store', () => {
  const { state: logs, execute: loadLogs } = useInvoke<ErrorLog[]>(Command.ReadErrorLogs, [], {
    shallow: false
  });

  return { logs, loadLogs };
});
