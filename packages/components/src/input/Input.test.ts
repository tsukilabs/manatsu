import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import Input from './Input.vue';

enableAutoUnmount(afterEach);

describe('input', () => {
  it('should update modelValue', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'some-text',
        'onUpdate:modelValue': async (e: string) => {
          await wrapper.setProps({ modelValue: e });
        }
      }
    });

    expect(wrapper.props('modelValue')).toBe('some-text');

    await wrapper.find('input').setValue('test');
    expect(wrapper.props('modelValue')).toBe('test');
  });
});
