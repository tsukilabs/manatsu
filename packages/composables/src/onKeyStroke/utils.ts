import { handleError } from '@manatsu/shared';
import type { Nullish } from '@tb-dev/utility-types';
import { isDev } from '@manatsu/tauri-plugin/src/index.ts';
import type { RouteLocationRaw, Router } from 'vue-router';
import { type InvokeArgs, invoke } from '@tauri-apps/api/core';
import type { ExecutorOptions, KeyStrokeEventHandler } from './types';

export function createExecutor() {
  let dev: boolean | null = null;

  return async function (
    event: KeyboardEvent,
    options: ExecutorOptions,
    handler?: KeyStrokeEventHandler
  ) {
    if (typeof dev !== 'boolean') {
      try {
        const result = await isDev();
        if (typeof dev !== 'boolean') dev = result;
      } catch (err) {
        handleError(err);
      }
    }

    if (options.dev && !dev) return;

    await handler?.(event);
  };
}

export const execute = createExecutor();

export function invokeCommand(command: string, args?: Nullish<InvokeArgs>) {
  return async function () {
    await invoke(command, args ?? undefined);
  };
}

export function pushRoute(router: Nullish<Router>, to: RouteLocationRaw) {
  if (!router) throw new Error('router is not available');
  return async function () {
    await router.push(to);
  };
}
