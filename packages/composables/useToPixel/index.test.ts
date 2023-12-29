import { isRef, nextTick, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { useToPixel } from '.';

describe('useToPixel', () => {
  it('should return a pixel string', async () => {
    const unit = useToPixel(10);
    await nextTick();

    expect(unit.value).toBe('10px');
  });

  it('should remain unchanged', async () => {
    const unit = useToPixel('2rem');
    await nextTick();

    expect(unit.value).toBe('2rem');
  });

  it('should return an object with pixel strings', async () => {
    const unit = useToPixel({
      a: '10px',
      b: 25,
      c: 50,
      d: ref(30)
    });

    await nextTick();

    expect(isRef(unit)).toBe(true);
    expect(Object.values(unit.value).every((v) => v.endsWith('px'))).toBe(true);
  });

  it('inner ref should remain reactive', async () => {
    const pixel = ref<string | number>(50);
    const unit = useToPixel({ pixel });

    await nextTick();
    expect(unit.value.pixel).toBe('50px');

    pixel.value = 200;
    await nextTick();
    expect(unit.value.pixel).toBe('200px');

    pixel.value = '3rem';
    await nextTick();
    expect(unit.value.pixel).toBe('3rem');
  });
});
