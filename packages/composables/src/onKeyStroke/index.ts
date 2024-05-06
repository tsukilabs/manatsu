import { toRef, toValue } from 'vue';
import { noop } from '@tb-dev/utils';
import { handleError } from '@manatsu/shared';
import type { RouteLocationRaw } from 'vue-router';
import type { Nullish } from '@tb-dev/utility-types';
import type { InvokeArgs } from '@tauri-apps/api/core';
import { execute, invokeCommand, pushRoute } from './utils';
import { type KeyFilter, onKeyStroke as original, tryOnScopeDispose } from '@vueuse/core';
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
  options?: Omit<OnKeyStrokeOptions, 'altKey'>
) {
  return onKeyStroke(key, handler, { ...options, altKey: true });
}

export function onAltKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'eventName' | 'altKey'>
) {
  return onKeyDown(key, handler, { ...options, altKey: true });
}

export function onCtrlKeyStroke(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'ctrlKey'>
) {
  return onKeyStroke(key, handler, { ...options, ctrlKey: true });
}

export function onCtrlKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'eventName' | 'ctrlKey'>
) {
  return onKeyDown(key, handler, { ...options, ctrlKey: true });
}

export function onShiftKeyStroke(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'shiftKey'>
) {
  return onKeyStroke(key, handler, { ...options, shiftKey: true });
}

export function onShiftKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'eventName' | 'shiftKey'>
) {
  return onKeyDown(key, handler, { ...options, shiftKey: true });
}

export function onCtrlShiftKeyStroke(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'ctrlKey' | 'shiftKey'>
) {
  return onKeyStroke(key, handler, { ...options, ctrlKey: true, shiftKey: true });
}

export function onCtrlShiftKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'eventName' | 'ctrlKey' | 'shiftKey'>
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
  return onKeyStroke(key, pushRoute(to), options);
}

export function navigateOnKeyDown(
  key: KeyFilter,
  to: RouteLocationRaw,
  options?: Omit<OnKeyStrokeOptions, 'eventName'>
) {
  return onKeyDown(key, pushRoute(to), options);
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
