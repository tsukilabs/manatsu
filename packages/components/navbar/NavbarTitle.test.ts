import { h } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import NavbarTitle from './NavbarTitle.vue';

enableAutoUnmount(afterEach);

describe('navbar-title', () => {
  it('should have title inside span', () => {
    const wrapper = mount(NavbarTitle, { props: { title: 'Manatsu' } });

    const title = wrapper.find('span');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe('Manatsu');
  });

  it('should use render function', () => {
    const wrapper = mount(NavbarTitle, {
      props: { title: () => h('div', 'Manatsu') }
    });

    const title = wrapper.find('div');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe('Manatsu');
  });
});
