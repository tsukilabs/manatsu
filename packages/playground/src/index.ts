import 'manatsu/src/assets/main.scss';
import { createApp } from 'vue';
import { createManatsu } from 'manatsu/src/index.ts';
import { createMemoryHistory, createRouter } from 'vue-router';
import App from './App.vue';
import HomeView from './views/HomeView.vue';
import AboutView from './views/AboutView.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/about', component: AboutView }
  ]
});

const app = createApp(App);
const manatsu = createManatsu();

app.use(router);
void router.push('/');

app.use(manatsu);
app.mount('#app');
