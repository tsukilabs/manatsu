import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Button from './Button.vue';

enableAutoUnmount(afterEach);

describe('button', () => {
  it('should emit event on click', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Button, { props: { onClick } });

    await wrapper.trigger('click');

    expect(onClick).toHaveBeenCalled();
  });
});
