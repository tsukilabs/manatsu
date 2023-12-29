import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import Icon from './Icon.vue';

enableAutoUnmount(afterEach);

describe('icon', () => {
  it('should render social icon', () => {
    const wrapper = mount(Icon, { props: { icon: 'github' } });

    expect(wrapper.find('svg').exists()).toBe(true);
  });
});
