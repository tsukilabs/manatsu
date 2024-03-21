import { randomFillSync } from 'node:crypto';
import { until } from '@vueuse/core';
import { createApp, nextTick, ref } from 'vue';
import { clearMocks, mockIPC } from '@tauri-apps/api/mocks';
import { Command } from '@manatsu/tauri-plugin/src/index.ts';
import { createManatsu } from '@manatsu/vue-plugin/src/index.ts';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineInvoke } from '.';

declare global {
  interface Window {
    __TAURI_IPC__: any;
  }
}

describe('defineInvoke', () => {
  beforeAll(() => {
    void createApp({}).use(createManatsu());

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

  const useInvoke = defineInvoke(Command);

  it('should invoke a command', async () => {
    const loading = ref(false);
    const result = useInvoke('RandomStringHexColor', '#FFFFFF', { loading });
    expect(result.value).toBe('#FFFFFF');

    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 100, throwOnTimeout: true });

    expect(result.value).toBe('#000000');
  });

  it('should not execute immediately', async () => {
    const loading = ref(false);
    const result = useInvoke('RandomStringHexColor', null, { loading, lazy: true });
    expect(result.value).toBeNull();

    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 100, throwOnTimeout: true });

    expect(result.value).toBeNull();
  });

  it('should execute manually', async () => {
    const loading = ref(false);
    const result = useInvoke('RandomStringHexColor', null, { loading, lazy: true });
    expect(result.value).toBeNull();

    await result.execute();
    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 100, throwOnTimeout: true });

    expect(result.value).toBe('#000000');
  });

  it('should invoke again if the command changes', async () => {
    const loading = ref(false);
    const command = ref<keyof typeof Command>('RandomStringHexColor');
    const result = useInvoke(command, '#FFFFFF', { loading });

    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 100, throwOnTimeout: true });

    expect(result.value).toBe('#000000');

    command.value = 'RandomStringRgbColor';
    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 100, throwOnTimeout: true });

    expect(result.value).toBe('rgb(0, 0, 0)');
  });

  it('should throw if the command is invalid', async () => {
    const onError = vi.fn();

    const loading = ref(false);
    useInvoke(null as any, null, { loading, onError });

    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 100, throwOnTimeout: true });

    expect(onError).toHaveBeenCalledOnce();
  });
});

function handleCommand<T>(command: string): T {
  switch (command) {
    case Command.RandomStringHexColor:
      return '#000000' as T;
    case Command.RandomStringRgbColor:
      return 'rgb(0, 0, 0)' as T;
    default:
      return '' as T;
  }
}
