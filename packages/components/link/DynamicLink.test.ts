import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import DynamicLink from './DynamicLink.vue';

enableAutoUnmount(afterEach);

describe('dynamic-link', () => {
  it('should render span if `to` is `undefined`', () => {
    const wrapper = mount(DynamicLink);
    expect(wrapper.find('span').exists()).toBe(true);
  });

  it('should render anchor if `to` is external', () => {
    const wrapper = mount(DynamicLink, { props: { to: 'https://tb.dev.br/' } });

    const anchor = wrapper.find('a:not([class*="router-link"])');
    expect(anchor.exists()).toBe(true);
  });

  it('should render router-link if `to` is a route', async () => {
    const Home = { template: '<div>Home</div>' };
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Home }]
    });

    await router.push('/');
    await router.isReady();

    const wrapper = mount(DynamicLink, {
      props: { to: '/' },
      global: {
        plugins: [router]
      }
    });

    const anchor = wrapper.find('a[class*="router-link"]');
    expect(anchor.exists()).toBe(true);
  });
});
