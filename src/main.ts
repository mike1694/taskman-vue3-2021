import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/global.css';
// import './assets/scss/main.scss';

const app = createApp(App);

app.directive('focus', {
  // When the bound element is mounted into the DOM...
  mounted(el: HTMLElement) {
    // Focus the element
    el.focus();
  }
});

app.use(store)
    .use(router)
.mount('#app');
