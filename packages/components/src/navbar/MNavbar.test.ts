import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import MNavbar from './MNavbar.vue';
import type { NavbarMenuItem } from './types';

enableAutoUnmount(afterEach);

describe('navbar', () => {
  it('should render menu items', () => {
    const wrapper = mount(MNavbar, { props: { menuItems: createMenuItems() } });
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
