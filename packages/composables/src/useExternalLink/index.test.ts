import { nextTick, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { useExternalLink } from '.';

describe('useExternalLink', () => {
  it('should work as intended', async () => {
    const link = ref<string | null>('https://github.com/tsukilabs/manatsu');
    const isExternalLink = useExternalLink(link);

    await nextTick();
    expect(isExternalLink.value).toBe(true);

    link.value = 'home';
    await nextTick();
    expect(isExternalLink.value).toBe(false);

    link.value = null;
    await nextTick();
    expect(isExternalLink.value).toBe(false);
  });
});
