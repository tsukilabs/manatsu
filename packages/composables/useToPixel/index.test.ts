import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import { useToPixel } from '.';

describe('useToPixel', () => {
  it.concurrent('should be a string', async () => {
    const unit = useToPixel(10);
    await nextTick();

    expect(unit.value).toBe('10px');
  });

  it.concurrent('should remain unchanged', async () => {
    const unit = useToPixel('2rem');
    await nextTick();

    expect(unit.value).toBe('2rem');
  });
});
