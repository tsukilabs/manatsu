import { h } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import Navbar from './Navbar.vue';
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
    const wrapper = mount(Navbar, { props: { logo: () => h('img') } });
    expect(wrapper.find('.m-navbar-logo').exists()).toBe(true);
  });

  it('should have title', () => {
    const wrapper = mount(Navbar, { props: { title: 'Hello, Manatsu!' } });
    expect(wrapper.find('.m-navbar-title').exists()).toBe(true);
  });

  it('should have social links', () => {
    const socialLinks: IconLinkProps[] = [
      { icon: 'github', to: 'https://example.com/0' },
      { icon: 'facebook', to: 'https://example.com/1' },
      { icon: 'discord', to: 'https://example.com/2' },
      { icon: 'instagram', to: 'https://example.com/3' },
      { icon: 'x', to: 'https://example.com/4' }
    ];

    const wrapper = mount(Navbar, { props: { socialLinks } });
    expect(wrapper.findAll('.m-icon-link')).toHaveLength(5);
  });
});
