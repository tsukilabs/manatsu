import { type Ref, nextTick, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { useIsEmpty } from '.';

describe('useIsEmpty', () => {
  it('should be empty', async () => {
    const value = ref<number[] | null>(null);
    const isEmpty = useIsEmpty(value);

    await nextTick();
    expect(isEmpty.value).toBe(true);

    value.value = [];
    await nextTick();
    expect(isEmpty.value).toBe(true);
  });

  it('should not be empty', async () => {
    const value = ref<number[] | string>([2]);
    const isEmpty = useIsEmpty(value as Ref<number[]>);

    await nextTick();
    expect(isEmpty.value).toBe(false);

    value.value = 'abc';
    await nextTick();
    expect(isEmpty.value).toBe(false);
  });
});
