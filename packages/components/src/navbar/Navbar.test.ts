import { h } from 'vue';
import { GitHub } from '@manatsu/icons/src/index.ts';
import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import Navbar from './Navbar.vue';
import type { NavbarMenuItem } from './types';
import type { IconLinkProps } from '../link/types';

enableAutoUnmount(afterEach);

describe('navbar', () => {
  it('should not have children', () => {
    const wrapper = mount(Navbar);
    expect(wrapper.find('.m-navbar-logo').exists()).toBe(false);
    expect(wrapper.find('.m-navbar-title').exists()).toBe(false);
    expect(wrapper.find('.m-navbar-social-links').exists()).toBe(false);
    expect(wrapper.findAll('.m-icon-link')).toHaveLength(0);
  });

  it('should have logo', () => {
    const wrapper = mount(Navbar, { slots: { logo: () => h('img') } });
    expect(wrapper.find('.m-navbar-logo').exists()).toBe(true);
  });

  it('should have title', () => {
    const wrapper = mount(Navbar, { slots: { title: () => h('span') } });
    expect(wrapper.find('.m-navbar-title').exists()).toBe(true);
  });

  it('should render menu items', () => {
    const wrapper = mount(Navbar, { props: { menuItems: createMenuItems() } });
    expect(wrapper.findAll('.m-navbar-menu-item')).toHaveLength(2);
  });

  it('should be render menu correctly', () => {
    const wrapper = mount(Navbar, { props: { menuItems: createMenuItems() } });

    // Render function
    const first = wrapper.find('.m-navbar-menu-item:nth-of-type(1) div');
    expect(first.exists()).toBe(true);
    expect(first.text()).toBe('First item');

    // Plain span.
    const second = wrapper.find('.m-navbar-menu-item:nth-of-type(2) span');
    expect(second.exists()).toBe(true);
    expect(second.text()).toBe('Second item');
  });

  it('should have social links', () => {
    const wrapper = mount(Navbar, {
      props: { socialLinks: createSocialLinks() }
    });

    expect(wrapper.findAll('.m-icon-link')).toHaveLength(5);
  });
});

function createMenuItems() {
  const items: NavbarMenuItem[] = [
    { key: 'first', label: () => h('div', 'First item') },
    { key: 'second', label: 'Second item' }
  ];

  return items;
}

function createSocialLinks() {
  const socialLinks: IconLinkProps[] = [];

  for (let i = 0; i < 5; i++) {
    socialLinks.push({ icon: () => h(GitHub), to: `https://example.com/${i}` });
  }

  return socialLinks;
}
