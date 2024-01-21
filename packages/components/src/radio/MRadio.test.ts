import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import MRadio from './MRadio.vue';

enableAutoUnmount(afterEach);

describe('radio', () => {
  it('should render label when label prop is provided', () => {
    const wrapper = mount(MRadio, {
      props: {
        label: 'Option 1'
      }
    });

    expect(wrapper.find('.m-radio-label').exists()).toBe(true);
    expect(wrapper.find('.m-radio-label').text()).toBe('Option 1');
  });

  it('should render label when default slot is provided', () => {
    const wrapper = mount(MRadio, {
      slots: {
        default: 'Option 2'
      }
    });

    expect(wrapper.find('.m-radio-label').exists()).toBe(true);
    expect(wrapper.find('.m-radio-label').text()).toBe('Option 2');
  });

  it('should bind v-model to radio group', async () => {
    const wrapper = mount({
      components: { MRadio },
      template: `
        <div>
          <m-radio id="a" v-model="checked" value="1">Radio 1</m-radio>
          <m-radio id="b" v-model="checked" value="2">Radio 2</m-radio>
          <m-radio id="c" v-model="checked" value="3">Radio 3</m-radio>
        </div>
      `,
      data() {
        return {
          checked: ''
        };
      }
    });

    expect(wrapper.vm.checked).toEqual('');

    await wrapper.find('#a input').setValue(true);
    expect(wrapper.vm.checked).toEqual('1');

    await wrapper.find('#b input').setValue(true);
    expect(wrapper.vm.checked).toEqual('2');

    await wrapper.find('#c input').setValue(true);
    expect(wrapper.vm.checked).toEqual('3');
  });
});
