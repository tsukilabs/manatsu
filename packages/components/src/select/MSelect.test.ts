import { afterEach, describe, it } from 'vitest';
import { config, enableAutoUnmount } from '@vue/test-utils';
import { createManatsu } from '@manatsu/vue-plugin/src/index.ts';
// import MSelect from './MSelect.vue';

enableAutoUnmount(afterEach);

config.global.plugins = [createManatsu()];

describe('select', () => {
  it.todo('todo');
});
