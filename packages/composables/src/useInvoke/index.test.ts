import { useInvoke } from '.';
import { until } from '@vueuse/core';
import { randomFillSync } from 'node:crypto';
import { createApp, nextTick, ref } from 'vue';
import { clearMocks, mockIPC } from '@tauri-apps/api/mocks';
import { Command } from '@manatsu/tauri-plugin/src/index.ts';
import { createManatsu } from '@manatsu/vue-plugin/src/index.ts';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

declare global {
  interface Window {
    __TAURI_IPC__: any;
  }
}

describe('useInvoke', () => {
  beforeAll(() => {
    createApp({}).use(createManatsu());

    Object.defineProperty(window, 'crypto', {
      value: {
        getRandomValues: (buffer: any) => {
          return randomFillSync(buffer);
        }
      }
    });
  });

  beforeEach(() => mockIPC(handleCommand));
  afterEach(() => clearMocks());

  it('should invoke a command', async () => {
    const { state, loading } = useInvoke(Command.ManatsuVersion, '0.7.0');
    expect(state.value).toBe('0.7.0');

    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 50, throwOnTimeout: true });

    expect(state.value).toBe('1.0.0');
  });

  it('should not execute immediately', async () => {
    const { state, loading } = useInvoke(Command.ManatsuVersion, null, { lazy: true });
    expect(state.value).toBeNull();

    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 50, throwOnTimeout: true });

    expect(state.value).toBeNull();
  });

  it('should execute manually', async () => {
    const { state, execute, loading } = useInvoke(Command.ManatsuVersion, null, {
      lazy: true
    });

    expect(state.value).toBeNull();

    await execute();
    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 50, throwOnTimeout: true });

    expect(state.value).toBe('1.0.0');
  });

  it('should invoke again if the command changes', async () => {
    const command = ref<Command>(Command.ManatsuVersion);
    const { state, loading } = useInvoke(command, '0.7.0');

    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 50, throwOnTimeout: true });

    expect(state.value).toBe('1.0.0');

    command.value = Command.LogPath;
    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 50, throwOnTimeout: true });

    expect(state.value).toBe('error.log');
  });

  it('should throw if the command is invalid', async () => {
    const onError = vi.fn();
    const { loading } = useInvoke(null as any, null, { onError });

    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 50, throwOnTimeout: true });

    expect(onError).toHaveBeenCalledOnce();
  });
});

function handleCommand<T>(command: string): T {
  switch (command) {
    case Command.ManatsuVersion:
      return '1.0.0' as T;
    case Command.LogPath:
      return 'error.log' as T;
    default:
      throw new Error('invalid command');
  }
}
