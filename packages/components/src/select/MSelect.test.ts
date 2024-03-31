import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { createManatsu } from '@manatsu/vue-plugin/src/index.ts';
import { config, enableAutoUnmount, mount } from '@vue/test-utils';
import MSelect from './MSelect.vue';
import type { SelectOption } from './types';

enableAutoUnmount(afterEach);

config.global.plugins = [createManatsu()];
config.global.stubs = { teleport: true };

describe('select', () => {
  it('should open dropdown when clicked', async () => {
    const wrapper = mount(MSelect, {
      attachTo: document.body,
      props: {
        options: generateOptions(5),
        modelValue: null
      }
    });

    expect(wrapper.find('.m-select-dropdown').exists()).toBe(false);

    await wrapper.find('.m-select-label').trigger('click');
    expect(wrapper.find('.m-select-dropdown').exists()).toBe(true);
  });

  it('should close dropdown on click outside', async () => {
    const wrapper = mount(MSelect, {
      attachTo: document.body,
      props: {
        options: generateOptions(5),
        modelValue: null
      }
    });

    await wrapper.find('.m-select-label').trigger('click');
    expect(wrapper.find('.m-select-dropdown').exists()).toBe(true);

    document.body.click();
    await nextTick();

    expect(wrapper.find('.m-select-dropdown').exists()).toBe(false);
  });

  it('should close dropdown on option select', async () => {
    const wrapper = mount(MSelect, {
      attachTo: document.body,
      props: {
        options: generateOptions(5),
        modelValue: null
      }
    });

    await wrapper.find('.m-select-label').trigger('click');
    expect(wrapper.find('.m-select-dropdown').exists()).toBe(true);

    await wrapper.find('.m-select-dropdown > li').trigger('click');
    expect(wrapper.find('.m-select-dropdown').exists()).toBe(false);
  });

  it('should not close dropdown on option select when multiple', async () => {
    const wrapper = mount(MSelect, {
      attachTo: document.body,
      props: {
        options: generateOptions(5),
        modelValue: null,
        multiple: true
      }
    });

    await wrapper.find('.m-select-label').trigger('click');
    expect(wrapper.find('.m-select-dropdown').exists()).toBe(true);

    await wrapper.find('.m-select-dropdown > li').trigger('click');
    expect(wrapper.find('.m-select-dropdown').exists()).toBe(true);
  });

  it('should transform option text', async () => {
    const wrapper = mount(MSelect, {
      attachTo: document.body,
      props: {
        options: generateOptions(5),
        modelValue: null,
        transform: () => 'TEST'
      }
    });

    await wrapper.find('.m-select-label').trigger('click');
    expect(wrapper.find('.m-select-dropdown').exists()).toBe(true);

    const options = wrapper.findAll('.m-select-dropdown > li');
    expect(options).toHaveLength(5);

    for (const option of options) {
      expect(option.text()).toBe('TEST');
    }
  });

  it('should show placeholder when no value', () => {
    const wrapper = mount(MSelect, {
      attachTo: document.body,
      props: {
        options: generateOptions(5),
        modelValue: null,
        placeholder: 'placeholder'
      }
    });

    expect(wrapper.find('.m-select-label').text()).toBe('placeholder');
  });

  it('should select multiple options', async () => {
    const wrapper = mount(MSelect, {
      attachTo: document.body,
      props: {
        options: generateOptions(5),
        modelValue: [],
        multiple: true
      }
    });

    await wrapper.find('.m-select-label').trigger('click');
    expect(wrapper.find('.m-select-dropdown').exists()).toBe(true);

    const options = wrapper.findAll('.m-select-dropdown > li');
    await options[0].trigger('click');
    await options[1].trigger('click');
    await options[2].trigger('click');

    expect(wrapper.props('modelValue')).toEqual(['Option 1', 'Option 2', 'Option 3']);

    await options[0].trigger('click');
    expect(wrapper.props('modelValue')).toEqual(['Option 2', 'Option 3']);
  });
});

function generateOptions(amount: number) {
  const array: string[] = [];
  for (let i = 0; i < amount; i++) {
    array.push(`Option ${i + 1}`);
  }

  return array.map<SelectOption>((value) => ({ key: value, value }));
}
