import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import MDialog from './MDialog.vue';

enableAutoUnmount(afterEach);

describe('dialog', () => {
  it('should render dialog when visible', async () => {
    const wrapper = mount(MDialog, {
      global: {
        stubs: { teleport: true }
      },
      props: {
        visible: false,
        'onUpdate:visible': async (value: boolean) => {
          await wrapper.setProps({ visible: value });
        }
      }
    });

    expect(wrapper.find('.m-dialog').exists()).toBe(false);

    await wrapper.setProps({ visible: true });
    expect(wrapper.find('.m-dialog').exists()).toBe(true);
  });

  it('should render header slot when provided', () => {
    const wrapper = mount(MDialog, {
      global: {
        stubs: { teleport: true }
      },
      props: { visible: true },
      slots: { header: '<div class="header-slot">Header</div>' }
    });

    expect(wrapper.find('.header-slot').exists()).toBe(true);
  });

  it('should render footer slot when provided', () => {
    const wrapper = mount(MDialog, {
      global: {
        stubs: { teleport: true }
      },
      props: { visible: true },
      slots: { footer: '<div class="footer-slot">Footer</div>' }
    });

    expect(wrapper.find('.footer-slot').exists()).toBe(true);
  });

  it('should close when escape key is pressed', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      global: {
        stubs: { teleport: true }
      },
      props: {
        esc: true,
        visible: true,
        'onUpdate:visible': async (value: boolean) => {
          await wrapper.setProps({ visible: value });
        }
      }
    });

    expect(wrapper.find('.m-dialog').exists()).toBe(true);

    await wrapper.trigger('keydown', { key: 'Escape' });

    expect(wrapper.find('.m-dialog').exists()).toBe(false);
  });
});
