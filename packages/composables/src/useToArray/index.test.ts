import { nextTick, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { useToArray } from '.';

describe('useToPixel', () => {
  it('should become an array', async () => {
    const value = ref<number | null>(10);
    const array = useToArray(value);

    await nextTick();
    expect(array.value).toEqual([10]);

    value.value = null;
    await nextTick();
    expect(array.value).toEqual([]);
  });

  it('should remain unchanged', async () => {
    const value = ref([5]);
    const pixel = useToArray(value);

    await nextTick();
    expect(pixel.value).toEqual([5]);
  });
});
