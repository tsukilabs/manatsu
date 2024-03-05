import './assets/style.css';
import 'manatsu/src/style/main.scss';
import { createApp } from 'vue';
import { createManatsu, registerComponents } from 'manatsu/src/index.ts';
import App from './App.vue';
import { router } from './routes';
import { StorageKey } from './utils';

const app = createApp(App);
const manatsu = createManatsu({ darkMode: true });

registerComponents(app);

app.use(router);
app.use(manatsu);

router
  .push(localStorage.getItem(StorageKey.LastRoute) ?? '/')
  .then(() => router.isReady())
  .then(() => app.mount('#app'))
  .catch((err: unknown) => console.error(err));
