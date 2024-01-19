import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import { useBorder } from '.';

describe('useBorder', () => {
  it('should return "none" when border is null or undefined', async () => {
    const border = null;
    const defaultBorder = '1px solid black';
    const result = useBorder(border, defaultBorder);

    await nextTick();
    expect(result.value).toBe('none');
  });

  it('should return the border value when defaultBorder is a string', async () => {
    const border = '2px dashed red';
    const defaultBorder = '1px solid black';
    const result = useBorder(border, defaultBorder);

    await nextTick();
    expect(result.value).toBe(border);
  });

  it('should return the default border value when border is not a string', async () => {
    const border = true;
    const defaultBorder = '1px solid black';
    const result = useBorder(border, defaultBorder);

    await nextTick();
    expect(result.value).toBe(defaultBorder);
  });
});
