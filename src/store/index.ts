import { createStore } from 'vuex';

import tasks from './tasks';
import task_settings from './task_settings';
import history from './history';

export default createStore({
  state: {
  },
  mutations: {
  },
  getters: {
  },
  actions: {
  },
  modules: {
    tasks,
    task_settings,
    history
  }
})
