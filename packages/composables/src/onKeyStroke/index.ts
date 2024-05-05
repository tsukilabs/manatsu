import { toRef, toValue } from 'vue';
import { noop } from '@tb-dev/utils';
import type { RouteLocationRaw } from 'vue-router';
import type { Nullish } from '@tb-dev/utility-types';
import type { InvokeArgs } from '@tauri-apps/api/core';
import { getRouter, handleError } from '@manatsu/shared';
import { type KeyFilter, onKeyStroke as original, tryOnScopeDispose } from '@vueuse/core';
import { execute, invokeCommand, pushRoute } from './utils';
import type { KeyStrokeEventHandler, OnKeyStrokeOptions, PreventKeyStrokeOptions } from './types';

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
    dev = false,
    enabled = true,
    prevent = true
  } = options;

  const enabledRef = toRef(enabled);

  function callback(e: KeyboardEvent) {
    if (
      e.altKey !== altKey ||
      e.ctrlKey !== ctrlKey ||
      e.metaKey !== metaKey ||
      e.shiftKey !== shiftKey
    ) {
      return;
    }

    if (prevent) {
      e.preventDefault();
    }

    if (toValue(enabledRef)) {
      execute(e, { dev }, handler).catch(handleError);
    }
  }

  const stop = original(key, callback, options);

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

export function onAltKeyStroke(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: OnKeyStrokeOptions
) {
  return onKeyStroke(key, handler, { ...options, altKey: true });
}

export function onAltKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'eventName'>
) {
  return onKeyDown(key, handler, { ...options, altKey: true });
}

export function onCtrlKeyStroke(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: OnKeyStrokeOptions
) {
  return onKeyStroke(key, handler, { ...options, ctrlKey: true });
}

export function onCtrlKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'eventName'>
) {
  return onKeyDown(key, handler, { ...options, ctrlKey: true });
}

export function onShiftKeyStroke(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: OnKeyStrokeOptions
) {
  return onKeyStroke(key, handler, { ...options, shiftKey: true });
}

export function onShiftKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'eventName'>
) {
  return onKeyDown(key, handler, { ...options, shiftKey: true });
}

export function onCtrlShiftKeyStroke(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: OnKeyStrokeOptions
) {
  return onKeyStroke(key, handler, { ...options, ctrlKey: true, shiftKey: true });
}

export function onCtrlShiftKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'eventName'>
) {
  return onKeyDown(key, handler, { ...options, ctrlKey: true, shiftKey: true });
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

export function preventKeyStroke(key: KeyFilter, options?: PreventKeyStrokeOptions) {
  return onKeyStroke(key, noop, { ...options, prevent: true });
}

export function preventKeyDown(
  key: KeyFilter,
  options?: Omit<PreventKeyStrokeOptions, 'eventName'>
) {
  return onKeyDown(key, noop, { ...options, prevent: true });
}
