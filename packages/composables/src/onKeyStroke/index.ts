import type { RouteLocationRaw } from 'vue-router';
import type { Nullish } from '@tb-dev/utility-types';
import type { InvokeArgs } from '@tauri-apps/api/core';
import { getRouter, handleError } from '@manatsu/shared';
import { type KeyFilter, onKeyStroke as original, tryOnScopeDispose } from '@vueuse/core';
import { executeHandler, invokeCommand, pushRoute } from './utils';
import type { KeyStrokeEventHandler, OnKeyStrokeOptions } from './types';

export function onKeyStroke(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options: OnKeyStrokeOptions = {}
) {
  const {
    altKey = false,
    ctrlKey = false,
    metaKey = false,
    shiftKey = false,
    preventDefault = true
  } = options;

  const fn = (e: KeyboardEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }

    if (
      e.altKey !== altKey ||
      e.ctrlKey !== ctrlKey ||
      e.metaKey !== metaKey ||
      e.shiftKey !== shiftKey
    ) {
      return;
    }

    executeHandler(e, handler).catch(handleError);
  };

  const stop = original(key, fn, options);

  tryOnScopeDispose(() => stop());

  return stop;
}

export function onKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options: Omit<OnKeyStrokeOptions, 'eventName'> = {}
) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keydown' });
}

export function onKeyPressed(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options: Omit<OnKeyStrokeOptions, 'eventName'> = {}
) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keypress' });
}

export function onKeyUp(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options: Omit<OnKeyStrokeOptions, 'eventName'> = {}
) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keyup' });
}

export function invokeOnKeyStroke(
  key: KeyFilter,
  command: string,
  args?: Nullish<InvokeArgs>,
  options?: OnKeyStrokeOptions
) {
  return onKeyStroke(key, invokeCommand(command, args), options);
}

export function invokeOnKeyDown(
  key: KeyFilter,
  command: string,
  args?: Nullish<InvokeArgs>,
  options?: Omit<OnKeyStrokeOptions, 'eventName'>
) {
  return onKeyDown(key, invokeCommand(command, args), options);
}

export function invokeOnKeyPressed(
  key: KeyFilter,
  command: string,
  args?: Nullish<InvokeArgs>,
  options?: Omit<OnKeyStrokeOptions, 'eventName'>
) {
  return onKeyPressed(key, invokeCommand(command, args), options);
}

export function invokeOnKeyUp(
  key: KeyFilter,
  command: string,
  args?: Nullish<InvokeArgs>,
  options?: Omit<OnKeyStrokeOptions, 'eventName'>
) {
  return onKeyUp(key, invokeCommand(command, args), options);
}

export function navigateOnKeyStroke(
  key: KeyFilter,
  to: RouteLocationRaw,
  options?: OnKeyStrokeOptions
) {
  const router = getRouter();
  return onKeyStroke(key, pushRoute(router, to), options);
}

export function navigateOnKeyDown(
  key: KeyFilter,
  to: RouteLocationRaw,
  options?: Omit<OnKeyStrokeOptions, 'eventName'>
) {
  const router = getRouter();
  return onKeyDown(key, pushRoute(router, to), options);
}

export function navigateOnKeyPressed(
  key: KeyFilter,
  to: RouteLocationRaw,
  options?: Omit<OnKeyStrokeOptions, 'eventName'>
) {
  const router = getRouter();
  return onKeyPressed(key, pushRoute(router, to), options);
}

export function navigateOnKeyUp(
  key: KeyFilter,
  to: RouteLocationRaw,
  options?: Omit<OnKeyStrokeOptions, 'eventName'>
) {
  const router = getRouter();
  return onKeyUp(key, pushRoute(router, to), options);
}
