import { h } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { createManatsu } from '@manatsu/vue-plugin/src/index.ts';
import { config, enableAutoUnmount, mount } from '@vue/test-utils';
import MScaffold from './MScaffold.vue';

enableAutoUnmount(afterEach);

config.global.plugins = [createManatsu()];

describe('scaffold', () => {
  it('should render top slot', () => {
    const wrapper = mount(MScaffold, {
      slots: {
        top: () => h('div', { id: 'top-slot' })
      }
    });

    expect(wrapper.find('.m-scaffold-top').exists()).toBe(true);
    expect(wrapper.find('#top-slot').exists()).toBe(true);
  });

  it('should not render top slot', () => {
    const wrapper = mount(MScaffold, {
      slots: {
        default: () => h('div', 'Default slot')
      }
    });

    expect(wrapper.find('.m-scaffold-top').exists()).toBe(false);
  });

  it('should render bottom slot', () => {
    const wrapper = mount(MScaffold, {
      slots: {
        bottom: () => h('div', { id: 'bottom-slot' })
      }
    });

    expect(wrapper.find('.m-scaffold-bottom').exists()).toBe(true);
    expect(wrapper.find('#bottom-slot').exists()).toBe(true);
  });

  it('should not render bottom slot', () => {
    const wrapper = mount(MScaffold, {
      slots: {
        default: () => h('div', 'Default slot')
      }
    });

    expect(wrapper.find('.m-scaffold-bottom').exists()).toBe(false);
  });
});
