import 'manatsu/src/assets/main.scss';
import { createApp } from 'vue';
import { createManatsu } from 'manatsu/src/index.ts';
import App from './App.vue';

const app = createApp(App);
const manatsu = createManatsu();

app.use(manatsu);
app.mount('#app');
