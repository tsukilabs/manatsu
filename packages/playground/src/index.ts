import './assets/style.css';
import 'manatsu/src/style/main.scss';
import { createApp } from 'vue';
import { createManatsu } from 'manatsu/src/index.ts';
import { createMemoryHistory, createRouter } from 'vue-router';
import App from './App.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: () => import('./views/HomeView.vue') },
    { path: '/about', component: () => import('./views/AboutView.vue') }
  ]
});

const app = createApp(App);
const manatsu = createManatsu();

app.use(router);
app.use(manatsu);

router
  .push('/')
  .then(() => router.isReady())
  .then(() => app.mount('#app'))
  .catch((err: unknown) => console.error(err));
