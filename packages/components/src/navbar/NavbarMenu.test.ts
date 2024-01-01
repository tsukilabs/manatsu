import { h } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import type { NavbarMenuItem } from '.';
import NavbarMenu from './NavbarMenu.vue';

enableAutoUnmount(afterEach);

describe('navbar-menu', () => {
  it('should render menu items', () => {
    const wrapper = mount(NavbarMenu, { props: { items: createItems() } });
    expect(wrapper.findAll('.m-navbar-menu-item')).toHaveLength(2);
  });

  it('should be rendered correctly', () => {
    const wrapper = mount(NavbarMenu, { props: { items: createItems() } });

    // Render function
    const first = wrapper.find('.m-navbar-menu-item:nth-of-type(1) div');
    expect(first.exists()).toBe(true);
    expect(first.text()).toBe('First item');

    // Plain span.
    const second = wrapper.find('.m-navbar-menu-item:nth-of-type(2) span');
    expect(second.exists()).toBe(true);
    expect(second.text()).toBe('Second item');
  });
});

function createItems() {
  const items: NavbarMenuItem[] = [
    { key: 'first', label: () => h('div', 'First item') },
    { key: 'second', label: 'Second item' }
  ];

  return items;
}
