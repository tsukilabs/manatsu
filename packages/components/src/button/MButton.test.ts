import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MButton from './MButton.vue';

enableAutoUnmount(afterEach);

describe('button', () => {
  it('should emit event on click', async () => {
    const onClick = vi.fn();
    const wrapper = mount(MButton, { props: { onClick } });

    await wrapper.trigger('click');

    expect(onClick).toHaveBeenCalled();
  });
});
