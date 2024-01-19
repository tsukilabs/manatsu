import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import MCheckbox from './MCheckbox.vue';

enableAutoUnmount(afterEach);

describe('checkbox', () => {
  it('should update checked state', async () => {
    const wrapper = mount(MCheckbox, {
      props: {
        checked: false,
        'onUpdate:checked': async (e: boolean) => {
          await wrapper.setProps({ checked: e });
        }
      }
    });

    expect(wrapper.props('checked')).toBe(false);

    await wrapper.find('input[type="checkbox"]').setValue(true);
    expect(wrapper.props('checked')).toBe(true);
  });
});
