import { h } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import IconLink from './IconLink.vue';

enableAutoUnmount(afterEach);

describe('icon-link', () => {
  it('should render link and icon', () => {
    const wrapper = mount(IconLink, {
      props: { icon: 'github', to: 'https://tb.dev.br/' }
    });

    expect(wrapper.find('a').exists()).toBe(true);
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('should use render function', () => {
    const wrapper = mount(IconLink, {
      props: { icon: () => h('img'), to: 'https://tb.dev.br/' }
    });

    expect(wrapper.find('svg').exists()).toBe(false);
    expect(wrapper.find('img').exists()).toBe(true);
  });
});
