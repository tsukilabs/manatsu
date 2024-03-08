import { afterEach, describe, expect, it, vi } from 'vitest';
import { createManatsu } from '@manatsu/vue-plugin/src/index.ts';
import { config, enableAutoUnmount, mount } from '@vue/test-utils';
import MDialog from './MDialog.vue';

enableAutoUnmount(afterEach);

config.global.plugins = [createManatsu()];
config.global.stubs = { teleport: true };

describe('dialog', () => {
  it('should render dialog when visible', async () => {
    const wrapper = mount(MDialog, {
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
      props: { visible: true },
      slots: { header: '<div class="header-slot">Header</div>' }
    });

    expect(wrapper.find('.header-slot').exists()).toBe(true);
  });

  it('should render footer slot when provided', () => {
    const wrapper = mount(MDialog, {
      props: { visible: true },
      slots: { footer: '<div class="footer-slot">Footer</div>' }
    });

    expect(wrapper.find('.footer-slot').exists()).toBe(true);
  });

  it('should close when escape key is pressed', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
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

  it('should emit event on show', async () => {
    const onShow = vi.fn();
    const wrapper = mount(MDialog, {
      props: { onShow, visible: false }
    });

    expect(onShow).not.toHaveBeenCalled();

    await wrapper.setProps({ visible: true });
    expect(onShow).toHaveBeenCalled();
  });

  it('should emit event on hide', async () => {
    const onHide = vi.fn();
    const wrapper = mount(MDialog, {
      props: { onHide, visible: true }
    });

    expect(onHide).not.toHaveBeenCalled();

    await wrapper.setProps({ visible: false });
    expect(onHide).toHaveBeenCalled();
  });
});
