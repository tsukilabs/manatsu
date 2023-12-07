import 'manatsu/src/assets/main.scss';
import { createApp } from 'vue';
import { manatsu } from 'manatsu/src/index.ts';
import App from './App.vue';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const app = createApp(App);
app.use(manatsu);
app.mount('#app');
