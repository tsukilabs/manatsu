import { h } from 'vue';
import { GitHub } from '@manatsu/icons/src/index.ts';
import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import Icon from './Icon.vue';

enableAutoUnmount(afterEach);

describe('icon', () => {
  it('should render icon', () => {
    const wrapper = mount(Icon, { slots: { default: () => h(GitHub) } });

    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('should use component prop', () => {
    const wrapper = mount(Icon, {
      props: { component: GitHub, id: 'icon-prop' },
      slots: { default: () => h(GitHub, { id: 'icon-slot' }) }
    });

    expect(wrapper.find('#icon-prop').exists()).toBe(true);
    expect(wrapper.find('#icon-slot').exists()).toBe(false);
  });
});
