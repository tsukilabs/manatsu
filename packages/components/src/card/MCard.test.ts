import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MCard from './MCard.vue';

enableAutoUnmount(afterEach);

describe('card', () => {
  it('should render only the default slot', () => {
    const wrapper = mount(MCard, {
      slots: { default: 'Test Card' }
    });

    expect(wrapper.text()).toBe('Test Card');
    expect(wrapper.find('.m-card-content').exists()).toBe(true);
    expect(wrapper.find('.m-card-header').exists()).toBe(false);
    expect(wrapper.find('.m-card-media').exists()).toBe(false);
    expect(wrapper.find('.m-card-footer').exists()).toBe(false);
  });

  it('should render the header with title and subtitle', () => {
    const wrapper = mount(MCard, {
      props: {
        title: 'Test Title',
        subtitle: 'Test Subtitle'
      }
    });

    expect(wrapper.find('.m-card-header').exists()).toBe(true);
    expect(wrapper.find('.m-card-header .m-card-title').exists()).toBe(true);
    expect(wrapper.find('.m-card-header .m-card-title').text()).toContain('Test Title');
    expect(wrapper.find('.m-card-header .m-card-title').text()).toContain('Test Subtitle');
  });

  it('should render the title slot', () => {
    const wrapper = mount(MCard, {
      slots: {
        default: 'Test Card',
        title: '<div class="custom-title">Custom Title Content</div>'
      }
    });

    expect(wrapper.find('.m-card-header').exists()).toBe(true);
    expect(wrapper.find('.m-card-header .custom-title').exists()).toBe(true);
    expect(wrapper.find('.m-card-header .custom-title').text()).toBe('Custom Title Content');
  });

  it('should render the header with start and end slots', () => {
    const wrapper = mount(MCard, {
      slots: {
        default: 'Test Card',
        'header-start': '<div class="custom-start">Custom Start Content</div>',
        'header-end': '<div class="custom-end">Custom End Content</div>'
      }
    });

    expect(wrapper.find('.m-card-header').exists()).toBe(true);
    expect(wrapper.find('.m-card-header .custom-start').exists()).toBe(true);
    expect(wrapper.find('.m-card-header .custom-start').text()).toBe('Custom Start Content');
    expect(wrapper.find('.m-card-header .custom-end').exists()).toBe(true);
    expect(wrapper.find('.m-card-header .custom-end').text()).toBe('Custom End Content');
  });

  it('should render the media slot', () => {
    const wrapper = mount(MCard, {
      slots: {
        default: 'Test Card',
        media: '<img src="test-image.jpg" alt="Test Image">'
      }
    });

    expect(wrapper.find('.m-card-media').exists()).toBe(true);
    expect(wrapper.find('.m-card-media img').exists()).toBe(true);
  });

  it('should render the footer slot', () => {
    const wrapper = mount(MCard, {
      slots: {
        default: 'Test Card',
        footer: '<div class="custom-footer">Custom Footer Content</div>'
      }
    });

    expect(wrapper.find('.m-card-footer').exists()).toBe(true);
    expect(wrapper.find('.custom-footer').exists()).toBe(true);
    expect(wrapper.find('.custom-footer').text()).toBe('Custom Footer Content');
  });

  it('calls onClick when action button is clicked', async () => {
    const onClick = vi.fn();

    const wrapper = mount(MCard, {
      props: {
        actions: [{ key: 'action1', label: 'Action 1', onClick }]
      }
    });

    await wrapper.find('button').trigger('click');

    expect(onClick).toHaveBeenCalled();
  });
});
