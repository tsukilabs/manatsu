import type { DialogOptions } from '@manatsu/shared';

export const defaultStorage = 'local' satisfies DialogOptions['storageType'];

export const ignore = ['.m-select-dropdown'];

export function getInitialPosition(options: DialogOptions) {
  if (typeof options.storageKey !== 'string') {
    return getDefaultPosition();
  }

  const storage = getStorage(options.storageType ?? defaultStorage);
  const previousPosition = storage.getItem(options.storageKey);
  if (!previousPosition) return getDefaultPosition();

  try {
    const parsed = JSON.parse(previousPosition) as { x: string; y: string };
    const x = Number.parseFloat(parsed.x);
    const y = Number.parseFloat(parsed.y);

    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return getDefaultPosition();
    }

    return { x, y };
  } catch {
    return getDefaultPosition();
  }
}

function getDefaultPosition() {
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

export function getStorage(storageType: DialogOptions['storageType']) {
  return storageType === 'session' ? sessionStorage : localStorage;
}
