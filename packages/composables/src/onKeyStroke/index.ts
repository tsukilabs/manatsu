import { handleError } from '@manatsu/shared';
import type { MaybePromise, Nullish } from '@tb-dev/utility-types';
import {
  type KeyFilter,
  type OnKeyStrokeOptions,
  onKeyStroke as original,
  tryOnScopeDispose
} from '@vueuse/core';

type EventHandler = Nullish<(event: KeyboardEvent) => MaybePromise<void>>;

export function onKeyStroke(
  key: KeyFilter,
  handler?: EventHandler,
  options: OnKeyStrokeOptions = {}
) {
  const stop = original(
    key,
    (e) => {
      e.preventDefault();
      (async () => await handler?.(e))().catch(handleError);
    },
    options
  );

  tryOnScopeDispose(stop);

  return stop;
}

export function onKeyDown(
  key: KeyFilter,
  handler?: EventHandler,
  options: Omit<OnKeyStrokeOptions, 'eventName'> = {}
) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keydown' });
}

export function onKeyPressed(
  key: KeyFilter,
  handler?: EventHandler,
  options: Omit<OnKeyStrokeOptions, 'eventName'> = {}
) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keypress' });
}

export function onKeyUp(
  key: KeyFilter,
  handler?: EventHandler,
  options: Omit<OnKeyStrokeOptions, 'eventName'> = {}
) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keyup' });
}
