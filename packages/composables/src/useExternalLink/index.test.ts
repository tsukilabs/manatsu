import { nextTick, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { useExternalLink } from '.';

describe('useExternalLink', () => {
  it.todo('should work as intended', async () => {
    const link = ref('https://github.com/manatsujs/manatsu');
    const isExternalLink = useExternalLink(link);

    await nextTick();
    expect(isExternalLink.value).toBe(true);

    link.value = 'home';
    await nextTick();
    expect(isExternalLink.value).toBe(false);
  });
});
