import { fetch_post, fetch_get } from "@/api/fetch_api";
import ITaskItem from "@/types/ITaskItem";
const URL = 'http://localhost:3000';

export default {
  namespaced: true,
  state: {
    tasks: [] as ITaskItem[],
    edit_task: null as null | number
  },
  mutations: {
    set_all_tasks: (state: any, payload: ITaskItem[]) => state.tasks = payload,
    create_task: (state: any, payload: ITaskItem) => state.tasks = [...state.tasks, payload],
    set_updated_task: (state: any, payload: ITaskItem) => state.tasks =
      state.tasks.map((i: ITaskItem) => payload.id === i.id ? payload : i),
    toggle_edit_task: (state: any, payload: number | null) => state.edit_task =
      state.edit_task === payload ? null : payload,
    reset_edit_task: (state: any) => state.edit_task = null
  }, 
  getters: {
    get_all_tasks: (state: any): ITaskItem[] => state.tasks,
    get_edit_task: (state: any): number | null => state.edit_task,
  },
  actions: {
    get_tasks: (context: any) => {
      fetch_get(URL)
      .then((response: ITaskItem[]) => {
        context.commit('set_all_tasks', response);
      })
    },
    create_task: (context: any, payload: ITaskItem) => {
      fetch_post({
        url: URL,
        payload: {
          body: payload,
          action: '/task/create'
        }
      })
      .then((status: string) => {
        if(status) {
          context.commit('create_task', payload);
        }
      });
    },
    upd_task: (context: any, payload: ITaskItem) => {
      fetch_post({
        url: URL,
        payload: {
          body: payload,
          action: '/task/update'
        }
      })
      .then((status: string) => {
        if(status) {
          context.commit('set_updated_task', payload);
        }
      });
    }
  }
}