import { fetch_post, fetch_get } from "@/api/fetch_api";
import ITaskItem from "@/types/ITaskItem";
const URL = '/api';

export default {
  namespaced: true,
  state: {
    tasks: [] as ITaskItem[],
    edit_task: null as null | number,
    confirm_delete: null as null | number
  },
  mutations: {
    set_all_tasks: (state: any, payload: ITaskItem[]) => state.tasks = payload,
    create_task: (state: any, payload: ITaskItem) => state.tasks = [...state.tasks, payload],
    set_updated_task: (state: any, payload: ITaskItem) => state.tasks =
      state.tasks.map((i: ITaskItem) => payload.id === i.id ? payload : i),
    remove_task: (state: any, payload: number) => {
      state.tasks = state.tasks.filter((i: ITaskItem) => i.id !== payload);
    },
    toggle_edit_task: (state: any, payload: number | null) => state.edit_task =
      state.edit_task === payload ? null : payload,
    reset_edit_task: (state: any) => state.edit_task = null,
    show_confirm_delete: (state: any, payload: number) => {
      state.confirm_delete = payload;
    },
    hide_confirm_delete: (state: any) => {
      state.confirm_delete = null;
    }
  }, 
  getters: {
    get_all_tasks: (state: any): ITaskItem[] => state.tasks,
    get_edit_task: (state: any): number | null => state.edit_task,
    get_confirm_delete: (state: any): number | null => state.confirm_delete,
  },
  actions: {
    get_tasks: (context: any) => {
      fetch_get(URL)
      .then((response: ITaskItem[]) => {
        context.commit('set_all_tasks', response);
      })
      .catch((err: any) => console.error('get_tasks error:', err));
    },
    create_task: (context: any, payload: ITaskItem) => {
      fetch_post({
        url: URL,
        payload: {
          body: payload,
          action: '/task/create'
        }
      })
      .then((status: any) => {
        if (!status.error) {
          context.commit('create_task', payload);
        }
      })
      .catch((err: any) => console.error('create_task error:', err));
    },
    upd_task: (context: any, payload: ITaskItem) => {
      fetch_post({
        url: URL,
        payload: {
          body: payload,
          action: '/task/update'
        }
      })
      .then((status: any) => {
        if (!status.error) {
          context.commit('set_updated_task', payload);
        }
      })
      .catch((err: any) => console.error('upd_task error:', err));
    },
    delete_task: (context: any, id: number) => {
      context.commit('show_confirm_delete', id);
    },
    confirm_delete_task: (context: any, id: number) => {
      fetch_post({
        url: URL,
        payload: {
          body: { id },
          action: '/task/delete'
        }
      })
      .then((status: any) => {
        if (!status.error) {
          context.commit('remove_task', id);
          context.commit('hide_confirm_delete');
        }
      })
      .catch((err: any) => console.error('confirm_delete_task error:', err));
    },
    cancel_delete_task: (context: any) => {
      context.commit('hide_confirm_delete');
    }
  }
}
