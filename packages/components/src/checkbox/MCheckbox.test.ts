import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import MCheckbox from './MCheckbox.vue';

enableAutoUnmount(afterEach);

describe('checkbox', () => {
  it('should render label', () => {
    const wrapper = mount(MCheckbox, {
      slots: {
        default: 'Checkbox Label'
      }
    });

    const label = wrapper.find('.m-checkbox-label');
    expect(label.text()).toBe('Checkbox Label');
  });

  it('should bind v-model to checkbox', async () => {
    const wrapper = mount(MCheckbox, {
      props: {
        modelValue: false,
        'onUpdate:modelValue': async (value: boolean) => {
          await wrapper.setProps({ modelValue: value });
        }
      }
    });

    expect(wrapper.props('modelValue')).toBe(false);

    await wrapper.find('input').setValue(true);
    expect(wrapper.props('modelValue')).toBe(true);
  });

  it('should bind v-model to checkbox group', async () => {
    const wrapper = mount({
      components: { MCheckbox },
      template: `
        <div>
          <m-checkbox id="a" v-model="checked" value="1">Checkbox 1</m-checkbox>
          <m-checkbox id="b" v-model="checked" value="2">Checkbox 2</m-checkbox>
          <m-checkbox id="c" v-model="checked" value="3">Checkbox 3</m-checkbox>
        </div>
      `,
      data() {
        return {
          checked: []
        };
      }
    });

    expect(wrapper.vm.checked).toEqual([]);

    await wrapper.find('#a input').setValue(true);
    expect(wrapper.vm.checked).toEqual(['1']);

    await wrapper.find('#b input').setValue(true);
    expect(wrapper.vm.checked).toEqual(['1', '2']);

    await wrapper.find('#c input').setValue(true);
    expect(wrapper.vm.checked).toEqual(['1', '2', '3']);

    await wrapper.find('#b input').setValue(false);
    expect(wrapper.vm.checked).toEqual(['1', '3']);
  });
});
