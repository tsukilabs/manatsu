import { afterEach, describe, expect, it } from 'vitest';
import { createManatsu } from '@manatsu/vue-plugin/src/index.ts';
import { config, enableAutoUnmount, mount } from '@vue/test-utils';
import MChip from './MChip.vue';

enableAutoUnmount(afterEach);

config.global.plugins = [createManatsu()];

describe('chip', () => {
  it('should remove the chip', async () => {
    const wrapper = mount(MChip, {
      props: {
        removable: true
      }
    });

    expect(wrapper.find('.m-chip').exists()).toBe(true);
    await wrapper.find('.m-chip-close').trigger('click');

    expect(wrapper.emitted().remove).toHaveLength(1);
    expect(wrapper.find('.m-chip').exists()).toBe(false);
  });
});
