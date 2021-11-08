import { fetch_post, fetch_get } from "@/api/fetch_api";
const URL = 'http://localhost:3000';

export default {
  namespaced: true,
  state: {
    tasks: [],
    edit_task: null
  },
  mutations: {
    set_all_tasks: (state: any, payload: any) => state.tasks = payload,
    set_updated_task: (state: any, payload: any) => state.tasks =
      state.tasks.map((i: any) => payload.id === i.id ? payload : i),
    toggle_edit_task: (state: any, payload: string) => state.edit_task =
      state.edit_task === payload ? null : payload,
    reset_edit_task: (state: any) => state.edit_task = null
  }, 
  getters: {
    get_all_tasks: (state: any): [] => state.tasks,
    get_edit_task: (state: any): number | null => state.edit_task,
  },
  actions: {
    get_tasks: (context: any) => {
      fetch_get(URL)
      .then((response: any) => {
        context.commit('set_all_tasks', response);
      })
    },
    upd_all_tasks: (context: any, payload: any) => {
      fetch_post({
        url: URL,
        payload: {
          body: payload,
          action: '/'
        }
      })
      .then((status: any) => {
        if(status) {
          context.commit('set_all_tasks', payload);
        }
      });
    },
    upd_task: (context: any, payload: any) => {
      fetch_post({
        url: URL,
        payload: {
          body: payload,
          action: '/update'
        }
      })
      .then((status: any) => {
        if(status) {
          context.commit('set_updated_task', payload);
        }
      });
    }
  }
}