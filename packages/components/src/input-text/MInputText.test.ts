import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import MInputText from './MInputText.vue';

enableAutoUnmount(afterEach);

describe('input-text', () => {
  it('should update value', async () => {
    const wrapper = mount(MInputText, {
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
