import { h } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import MScaffold from './MScaffold.vue';

enableAutoUnmount(afterEach);

describe('scaffold', () => {
  it('should have top bar', () => {
    const wrapper = mount(MScaffold, {
      slots: {
        'top-bar': () => h('div', { id: 'top-bar-slot' })
      }
    });

    expect(wrapper.find('.m-scaffold-top-bar').exists()).toBe(true);
    expect(wrapper.find('#top-bar-slot').exists()).toBe(true);
  });

  it('should not have top bar', () => {
    const wrapper = mount(MScaffold, {
      slots: {
        default: () => h('div', 'Default slot')
      }
    });

    expect(wrapper.find('.m-scaffold-top-bar').exists()).toBe(false);
  });

  it('should have bottom bar', () => {
    const wrapper = mount(MScaffold, {
      slots: {
        'bottom-bar': () => h('div', { id: 'bottom-bar-slot' })
      }
    });

    expect(wrapper.find('.m-scaffold-bottom-bar').exists()).toBe(true);
    expect(wrapper.find('#bottom-bar-slot').exists()).toBe(true);
  });

  it('should not have bottom bar', () => {
    const wrapper = mount(MScaffold, {
      slots: {
        default: () => h('div', 'Default slot')
      }
    });

    expect(wrapper.find('.m-scaffold-bottom-bar').exists()).toBe(false);
  });
});
