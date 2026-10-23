import { createApp } from 'vue';

import { router } from '@/router';
import { pinia } from '@/store';
import '@/assets/css/global.css';

import App from '@/App.vue';
// import './assets/scss/main.scss';

const app = createApp(App);

app.directive('focus', {
  // When the bound element is mounted into the DOM...
  mounted(el: HTMLElement) {
    // Focus the element
    el.focus();
  },
});

app.use(pinia).use(router).mount('#app');
