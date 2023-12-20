import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Button from './Button.vue';

describe('button', () => {
  it('should render', () => {
    const label = 'My Button';
    const wrapper = mount(Button, {
      slots: {
        default: h('span', label)
      }
    });

    const button = wrapper.get('button');

    expect(button.text()).toBe(label);
  });
});
