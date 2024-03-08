import { afterEach, describe, expect, it } from 'vitest';
import { createManatsu } from '@manatsu/vue-plugin/src/index.ts';
import { config, enableAutoUnmount, mount } from '@vue/test-utils';
import MTopAppbar from './MTopAppbar.vue';
import type { TopAppbarMenuItem } from './types';

enableAutoUnmount(afterEach);

config.global.plugins = [createManatsu()];

describe('top-appbar', () => {
  it('should render menu items', () => {
    const wrapper = mount(MTopAppbar, { props: { menuItems: createMenuItems() } });
    expect(wrapper.findAll('.m-top-appbar-menu-item')).toHaveLength(2);
  });
});

function createMenuItems() {
  const items: TopAppbarMenuItem[] = [
    { key: 'first', label: 'First item' },
    { key: 'second', label: 'Second item' }
  ];

  return items;
}
