import { h } from 'vue';
import { GitHub } from '@manatsu/icons/src/index.ts';
import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import IconLink from './IconLink.vue';

enableAutoUnmount(afterEach);

describe('icon-link', () => {
  it('should render link and icon', () => {
    const wrapper = mount(IconLink, {
      props: { to: 'https://tb.dev.br/' },
      slots: { default: () => h(GitHub) }
    });

    expect(wrapper.find('a').exists()).toBe(true);
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('should use component prop', () => {
    const wrapper = mount(IconLink, {
      props: { icon: GitHub, id: 'icon-prop', to: 'https://tb.dev.br/' },
      slots: { default: () => h(GitHub, { id: 'icon-slot' }) }
    });

    expect(wrapper.find('#icon-prop').exists()).toBe(true);
    expect(wrapper.find('#icon-slot').exists()).toBe(false);
  });
});
