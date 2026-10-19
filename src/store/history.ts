import { fetch_post, fetch_get } from "@/api/fetch_api";
import IHistoryItem from "@/types/IHistoryItem";
const URL = '/api';

export default {
  namespaced: true,
  state: {
    history: [] as IHistoryItem[],
    edit_history: null as string | null,
    show_history_create: false as boolean,
    confirm_delete: null as null | number
  },
  mutations: {
    set_all_history: (state: any, payload: IHistoryItem[]) => state.history = payload,
    create_history: (state: any, payload: IHistoryItem) => state.history = [...state.history, payload],
    set_updated_history: (state: any, payload: IHistoryItem) => state.history =
      state.history.map((i: any) => payload.id === i.id ? payload : i),
    remove_history: (state: any, payload: number) => {
      state.history = state.history.filter((i: IHistoryItem) => i.id !== payload);
    },
    toggle_edit_history: (state: any, payload: string) => state.edit_history =
      state.edit_history === payload ? null : payload,
    reset_edit_history: (state: any) => state.edit_history = null,
    toggle_history_create: (state: any, payload?: boolean) => {
      if(typeof payload === 'boolean') {
        state.show_history_create = payload;
        return undefined;
      }
      state.show_history_create = !state.show_history_create;
    },
    show_confirm_delete: (state: any, payload: number) => {
      state.confirm_delete = payload;
    },
    hide_confirm_delete: (state: any) => {
      state.confirm_delete = null;
    }
  }, 
  getters: {
    get_all_history: (state: any): IHistoryItem[] => state.history,
    get_edit_history: (state: any): number | null => state.edit_history,
    get_confirm_delete: (state: any): number | null => state.confirm_delete,
  },
  actions: {
    get_history: (context: any) => {
      fetch_get(URL + '/get/history')
      .then((response: any) => {
        context.commit('set_all_history', response);
      })
      .catch((err: any) => console.error('get_history error:', err));
    },
    create_history: (context: any, payload: IHistoryItem) => {
      fetch_post({
        url: URL,
        payload: {
          body: payload,
          action: '/history/create'
        }
      })
      .then((status: any) => {
        if (!status.error) {
          context.commit('create_history', payload);
        }
      })
      .catch((err: any) => console.error('create_history error:', err));
    },
    upd_history: (context: any, payload: IHistoryItem) => {
      fetch_post({
        url: URL,
        payload: {
          body: payload,
          action: '/history/update'
        }
      })
      .then((status: any) => {
        if (!status.error) {
          context.commit('set_updated_history', payload);
        }
      })
      .catch((err: any) => console.error('upd_history error:', err));
    },
    delete_history: (context: any, id: number) => {
      context.commit('show_confirm_delete', id);
    },
    confirm_delete_history: (context: any, id: number) => {
      fetch_post({
        url: URL,
        payload: {
          body: { id },
          action: '/history/delete'
        }
      })
      .then((status: any) => {
        if (!status.error) {
          context.commit('remove_history', id);
          context.commit('hide_confirm_delete');
        }
      })
      .catch((err: any) => console.error('confirm_delete_history error:', err));
    },
    cancel_delete_history: (context: any) => {
      context.commit('hide_confirm_delete');
    }
  }
}
