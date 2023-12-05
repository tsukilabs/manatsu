import './assets/style.css';
import '@manatsu/themes/manatsu-light';
import { createApp } from 'vue';
import App from './App.vue';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const app = createApp(App);
app.mount('#app');
