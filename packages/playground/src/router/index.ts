import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

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
    path: '/components/chip',
    component: () => import('../views/components/ChipView.vue')
  },
  {
    path: '/components/dialog',
    component: () => import('../views/components/DialogView.vue')
  },
  {
    path: '/components/ellipsis',
    component: () => import('../views/components/EllipsisView.vue')
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
    path: '/components/scaffold',
    component: () => import('../views/components/ScaffoldView.vue')
  },
  {
    path: '/components/select',
    component: () => import('../views/components/SelectView.vue')
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
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../views/HomeView.vue') },
    { path: '/test', component: () => import('../views/TestView.vue') },
    { path: '/about', component: () => import('../views/AboutView.vue') },
    ...components
  ]
});
