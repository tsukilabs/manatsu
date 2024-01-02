import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import Scaffold from './Scaffold.vue';

enableAutoUnmount(afterEach);

describe('scaffold', () => {
  it('should have header', () => {
    const wrapper = mount(Scaffold, { props: { header: true } });
    expect(wrapper.find('.m-scaffold-header').exists()).toBe(true);
  });
});
