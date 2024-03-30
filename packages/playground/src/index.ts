import '@/assets/style.css';
import 'manatsu/components/style';
import '@manatsu/style/themes/mana';
import App from '@/App.vue';
import { createApp } from 'vue';
import { createManatsu, registerComponents } from 'manatsu/src/index.ts';
import { router } from './router';
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
