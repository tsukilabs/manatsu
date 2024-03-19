import { until } from '@vueuse/core';
import { createApp, nextTick, ref } from 'vue';
import { clearMocks, mockIPC } from '@tauri-apps/api/mocks';
import { Command } from '@manatsu/tauri-plugin/src/index.ts';
import { createManatsu } from '@manatsu/vue-plugin/src/index.ts';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineInvoke } from '.';

describe('defineInvoke', () => {
  beforeAll(() => void createApp({}).use(createManatsu()));
  beforeEach(() => mockIPC(handleCommand));
  afterEach(() => {
    clearMocks();
    vi.restoreAllMocks();
  });

  const useInvoke = defineInvoke(Command);

  it('should invoke a command', async () => {
    const spy = vi.spyOn(window, '__TAURI_IPC__');

    const loading = ref(false);
    const result = useInvoke('RandomStringHexColor', '#FFFFFF', { loading });
    expect(result.value).toBe('#FFFFFF');

    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 100, throwOnTimeout: true });

    expect(spy).toHaveBeenCalledOnce();
    expect(result.value).toBe('#000000');
  });

  it('should not execute immediately', async () => {
    const spy = vi.spyOn(window, '__TAURI_IPC__');

    const loading = ref(false);
    const result = useInvoke('RandomStringHexColor', null, { loading, lazy: true });
    expect(result.value).toBeNull();

    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 100, throwOnTimeout: true });

    expect(spy).not.toHaveBeenCalled();
  });

  it('should execute manually', async () => {
    const spy = vi.spyOn(window, '__TAURI_IPC__');

    const loading = ref(false);
    const result = useInvoke('RandomStringHexColor', null, { loading, lazy: true });
    expect(result.value).toBeNull();

    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 100, throwOnTimeout: true });

    expect(spy).not.toHaveBeenCalled();

    await result.execute();
    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 100, throwOnTimeout: true });

    expect(spy).toHaveBeenCalledOnce();
  });

  it('should invoke again if the command changes', async () => {
    const spy = vi.spyOn(window, '__TAURI_IPC__');

    const loading = ref(false);
    const command = ref<keyof typeof Command>('RandomStringHexColor');
    const result = useInvoke(command, '#FFFFFF', { loading });

    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 100, throwOnTimeout: true });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result.value).toBe('#000000');

    command.value = 'RandomStringRgbColor';
    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 100, throwOnTimeout: true });

    expect(spy).toHaveBeenCalledTimes(2);
    expect(result.value).toBe('rgb(0, 0, 0)');
  });

  it('should invoke again if the args change', async () => {
    const spy = vi.spyOn(window, '__TAURI_IPC__');

    const loading = ref(false);
    const args = ref<Record<string, string>>({ any: 'thing' });
    const result = useInvoke('RandomStringHexColor', null, { loading, args });

    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 100, throwOnTimeout: true });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result.value).toBe('#000000');

    args.value = { another: 'thing' };
    await nextTick();
    await until(loading).not.toBeTruthy({ timeout: 100, throwOnTimeout: true });

    expect(spy).toHaveBeenCalledTimes(2);
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

function handleCommand(command: string) {
  switch (command) {
    case Command.RandomStringHexColor:
      return '#000000';
    case Command.RandomStringRgbColor:
      return 'rgb(0, 0, 0)';
    default:
      return void 0;
  }
}
