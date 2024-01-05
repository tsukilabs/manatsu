import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import Navbar from './Navbar.vue';
import type { NavbarMenuItem } from './types';

enableAutoUnmount(afterEach);

describe('navbar', () => {
  it('should render menu items', () => {
    const wrapper = mount(Navbar, { props: { menuItems: createMenuItems() } });
    expect(wrapper.findAll('.m-navbar-menu-item')).toHaveLength(2);
  });
});

function createMenuItems() {
  const items: NavbarMenuItem[] = [
    { key: 'first', label: 'First item' },
    { key: 'second', label: 'Second item' }
  ];

  return items;
}
