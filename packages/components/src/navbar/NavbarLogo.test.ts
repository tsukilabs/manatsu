import { h } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import NavbarLogo from './NavbarLogo.vue';

enableAutoUnmount(afterEach);

describe('navbar-logo', () => {
  it('should have a image as logo', () => {
    const wrapper = mount(NavbarLogo, { props: { logo: 'src' } });
    expect(wrapper.find('img').exists()).toBe(true);
  });

  it('should use render function', () => {
    const wrapper = mount(NavbarLogo, { props: { logo: () => h('svg') } });
    expect(wrapper.find('svg').exists()).toBe(true);
  });
});
