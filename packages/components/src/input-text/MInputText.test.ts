import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import MInputText from './MInputText.vue';

enableAutoUnmount(afterEach);

describe('input-text', () => {
  it('should update value', async () => {
    const wrapper = mount(MInputText, {
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
