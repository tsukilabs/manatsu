import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import MToolbar from './MToolbar.vue';

enableAutoUnmount(afterEach);

describe('toolbar', () => {
  it('should render start slot', () => {
    const wrapper = mount(MToolbar, {
      slots: { start: '<div>Start</div>' }
    });

    expect(wrapper.find('.m-toolbar-start').exists()).toBe(true);
    expect(wrapper.find('.m-toolbar-center').exists()).toBe(false);
    expect(wrapper.find('.m-toolbar-end').exists()).toBe(false);
  });

  it('should render center slot', () => {
    const wrapper = mount(MToolbar, {
      slots: { center: '<div>Center</div>' }
    });

    expect(wrapper.find('.m-toolbar-center').exists()).toBe(true);
    expect(wrapper.find('.m-toolbar-start').exists()).toBe(false);
    expect(wrapper.find('.m-toolbar-end').exists()).toBe(false);
  });

  it('should render end slot', () => {
    const wrapper = mount(MToolbar, {
      slots: { end: '<div>End</div>' }
    });

    expect(wrapper.find('.m-toolbar-end').exists()).toBe(true);
    expect(wrapper.find('.m-toolbar-start').exists()).toBe(false);
    expect(wrapper.find('.m-toolbar-center').exists()).toBe(false);
  });

  it('should render as a header', () => {
    const wrapper = mount(MToolbar, {
      props: { tag: 'header' }
    });

    expect(wrapper.find('header').exists()).toBe(true);
  });
});
