import { nextTick, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { useToPixel } from '.';

describe('useToPixel', () => {
  it('should return a pixel string', async () => {
    const unit = ref(10);
    const pixel = useToPixel(unit);

    await nextTick();
    expect(pixel.value).toBe('10px');

    unit.value = 50;
    await nextTick();
    expect(pixel.value).toBe('50px');
  });

  it('should remain unchanged', () => {
    const pixel = useToPixel('2rem');

    expect(pixel.value).toBe('2rem');
  });
});
