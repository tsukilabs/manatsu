import { afterEach, describe, expect, it } from 'vitest';
import { createManatsu } from '@manatsu/vue-plugin/src/index.ts';
import { config, enableAutoUnmount, mount } from '@vue/test-utils';
import MEllipsis from './MEllipsis.vue';

enableAutoUnmount(afterEach);

config.global.plugins = [createManatsu()];

describe('ellipsis', () => {
  it('should render using `text` prop', () => {
    const wrapper = mount(MEllipsis, {
      props: {
        text: 'Hello, World!'
      }
    });

    expect(wrapper.text()).toBe('Hello, World!');
  });
});
