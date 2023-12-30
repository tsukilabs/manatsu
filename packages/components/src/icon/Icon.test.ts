import { h } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import Icon from './Icon.vue';

enableAutoUnmount(afterEach);

describe('icon', () => {
  it('should render icon', () => {
    const wrapper = mount(Icon, { props: { icon: 'github' } });

    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('should use render function', () => {
    const wrapper = mount(Icon, { props: { icon: () => h('img') } });

    expect(wrapper.find('svg').exists()).toBe(false);
    expect(wrapper.find('img').exists()).toBe(true);
  });
});
