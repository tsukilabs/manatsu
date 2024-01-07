import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import MInput from './MInput.vue';

enableAutoUnmount(afterEach);

describe('input', () => {
  it('should update value', async () => {
    const wrapper = mount(MInput, {
      props: {
        value: 'some-text',
        'onUpdate:value': async (e: string) => {
          await wrapper.setProps({ value: e });
        }
      }
    });

    expect(wrapper.props('value')).toBe('some-text');

    await wrapper.find('input').setValue('test');
    expect(wrapper.props('value')).toBe('test');
  });
});
