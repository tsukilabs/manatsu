import { h } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import MScaffold from './MScaffold.vue';

enableAutoUnmount(afterEach);

describe('scaffold', () => {
  it('should have top', () => {
    const wrapper = mount(MScaffold, {
      slots: {
        top: () => h('div', { id: 'top-slot' })
      }
    });

    expect(wrapper.find('.m-scaffold-top').exists()).toBe(true);
    expect(wrapper.find('#top-slot').exists()).toBe(true);
  });

  it('should not have top', () => {
    const wrapper = mount(MScaffold, {
      slots: {
        default: () => h('div', 'Default slot')
      }
    });

    expect(wrapper.find('.m-scaffold-top').exists()).toBe(false);
  });

  it('should have bottom', () => {
    const wrapper = mount(MScaffold, {
      slots: {
        bottom: () => h('div', { id: 'bottom-slot' })
      }
    });

    expect(wrapper.find('.m-scaffold-bottom').exists()).toBe(true);
    expect(wrapper.find('#bottom-slot').exists()).toBe(true);
  });

  it('should not have bottom', () => {
    const wrapper = mount(MScaffold, {
      slots: {
        default: () => h('div', 'Default slot')
      }
    });

    expect(wrapper.find('.m-scaffold-bottom').exists()).toBe(false);
  });
});
