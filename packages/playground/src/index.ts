import 'manatsu/src/assets/main.scss';
import { createApp } from 'vue';
import { manatsu } from 'manatsu/src/index.ts';
import App from './App.vue';

const app = createApp(App);
app.use(manatsu);
app.mount('#app');
