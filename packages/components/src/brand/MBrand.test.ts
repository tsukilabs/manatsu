import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import MBrand from './MBrand.vue';

enableAutoUnmount(afterEach);

describe('brand', () => {
  it('should render the logo slot', () => {
    const wrapper = mount(MBrand, {
      slots: { logo: '<img src="logo.png" alt="Logo" />' }
    });

    expect(wrapper.find('.m-brand-logo').exists()).toBe(true);
    expect(wrapper.find('.m-brand-logo img').exists()).toBe(true);
  });

  it('should not render the logo slot', () => {
    const wrapper = mount(MBrand);

    expect(wrapper.find('.m-brand-logo').exists()).toBe(false);
  });

  it('should render the title slot', () => {
    const wrapper = mount(MBrand, {
      slots: { title: 'Test Title' }
    });

    expect(wrapper.find('.m-brand-title').exists()).toBe(true);
    expect(wrapper.find('.m-brand-title').text()).toBe('Test Title');
  });

  it('should not render the title slot', () => {
    const wrapper = mount(MBrand);

    expect(wrapper.find('.m-brand-title').exists()).toBe(false);
  });
});
