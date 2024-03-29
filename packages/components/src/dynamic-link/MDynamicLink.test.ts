import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import MDynamicLink from './MDynamicLink.vue';

enableAutoUnmount(afterEach);

describe('dynamic-link', () => {
  it('should render span if `to` is `undefined`', () => {
    const wrapper = mount(MDynamicLink);
    expect(wrapper.find('span').exists()).toBe(true);
  });

  it('should render anchor if `to` is external', () => {
    const wrapper = mount(MDynamicLink, { props: { to: 'https://tb.dev.br/' } });
    expect(wrapper.find('a:not([class*="router-link"])').exists()).toBe(true);
  });

  it('should render router-link if `to` is a route', async () => {
    const home = { template: '<div>Home</div>' };
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: home }]
    });

    await router.push('/');
    await router.isReady();

    const wrapper = mount(MDynamicLink, {
      props: { to: '/' },
      global: { plugins: [router] }
    });

    expect(wrapper.find('a[class*="router-link"]').exists()).toBe(true);
  });
});
