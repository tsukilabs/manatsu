import { h } from 'vue';
import { expect, test } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from './Button.vue';

test('render', () => {
  const label = 'My Button';
  const wrapper = mount(Button, {
    slots: {
      default: h('span', label)
    }
  });

  const button = wrapper.get('button');

  expect(button.text()).toBe(label);
});
