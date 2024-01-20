import { type RouteRecordRaw, createMemoryHistory, createRouter } from 'vue-router';

const components: RouteRecordRaw[] = [
  {
    path: '/components/button',
    component: () => import('../views/components/ButtonView.vue')
  },
  {
    path: '/components/card',
    component: () => import('../views/components/CardView.vue')
  },
  {
    path: '/components/checkbox',
    component: () => import('../views/components/CheckboxView.vue')
  },
  {
    path: '/components/input',
    component: () => import('../views/components/InputView.vue')
  },
  {
    path: '/components/radio',
    component: () => import('../views/components/RadioView.vue')
  }
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: () => import('../views/HomeView.vue') },
    { path: '/about', component: () => import('../views/AboutView.vue') },
    ...components
  ]
});
