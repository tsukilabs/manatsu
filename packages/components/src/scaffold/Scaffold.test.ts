import { h } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import Scaffold from './Scaffold.vue';

enableAutoUnmount(afterEach);

describe('scaffold', () => {
  it('should have header', () => {
    const wrapper = mount(Scaffold, {
      slots: {
        header: () => h('div', { id: 'header-slot' })
      }
    });

    expect(wrapper.find('.m-scaffold-header').exists()).toBe(true);
    expect(wrapper.find('#header-slot').exists()).toBe(true);
  });

  it('should not have header', () => {
    const wrapper = mount(Scaffold, {
      slots: {
        default: () => h('div', 'Default slot')
      }
    });

    expect(wrapper.find('.m-scaffold-header').exists()).toBe(false);
  });
});
