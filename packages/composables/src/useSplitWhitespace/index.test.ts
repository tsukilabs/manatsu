import { nextTick, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { useSplitWhitespace } from '.';

describe('useSplitWhitespace', () => {
  it('should split', async () => {
    const raw = ref('abc def ghi');
    const list = useSplitWhitespace(raw);

    await nextTick();
    expect(list.value).toEqual(['abc', 'def', 'ghi']);
  });

  it('should split inside array', async () => {
    const raw = ref(['abc def  ghi    ', ' jkl']);
    const list = useSplitWhitespace(raw);

    await nextTick();
    expect(list.value).toEqual(['abc', 'def', 'ghi', 'jkl']);
  });

  it('should default to empty array', async () => {
    // eslint-disable-next-line vue/require-typed-ref
    const raw = ref(null);
    const list = useSplitWhitespace(raw);

    await nextTick();
    expect(list.value).toEqual([]);
  });
});
