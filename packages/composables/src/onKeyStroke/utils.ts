import type { Nullish } from '@tb-dev/utility-types';
import type { RouteLocationRaw, Router } from 'vue-router';
import { type InvokeArgs, invoke } from '@tauri-apps/api/core';
import type { KeyStrokeEventHandler } from './types';

export async function executeHandler(event: KeyboardEvent, handler?: KeyStrokeEventHandler) {
  await handler?.(event);
}

export function invokeCommand(command: string, args?: Nullish<InvokeArgs>) {
  return async function () {
    await invoke(command, args ?? undefined);
  };
}

export function pushRoute(router: Router, to: RouteLocationRaw) {
  return async function () {
    await router.push(to);
  };
}
