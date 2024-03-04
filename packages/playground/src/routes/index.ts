import { type RouteRecordRaw, createMemoryHistory, createRouter } from 'vue-router';

export const components: RouteRecordRaw[] = [
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
    path: '/components/dialog',
    component: () => import('../views/components/DialogView.vue')
  },
  {
    path: '/components/input-text',
    component: () => import('../views/components/InputTextView.vue')
  },
  {
    path: '/components/radio',
    component: () => import('../views/components/RadioView.vue')
  },
  {
    path: '/components/table',
    component: () => import('../views/components/TableView.vue')
  },
  {
    path: '/components/toolbar',
    component: () => import('../views/components/ToolbarView.vue')
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
