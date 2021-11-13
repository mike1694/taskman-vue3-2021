import { fetch_post, fetch_get } from "@/api/fetch_api";
import IHistoryItem from "@/types/IHistoryItem";
const URL = 'http://localhost:3000';

export default {
  namespaced: true,
  state: {
    history: [] as IHistoryItem[],
    edit_history: null as number | null,
    show_history_create: false as boolean
  },
  mutations: {
    set_all_history: (state: any, payload: IHistoryItem[]) => state.history = payload,
    create_history: (state: any, payload: IHistoryItem) => state.history = [...state.history, payload],
    set_updated_history: (state: any, payload: IHistoryItem) => state.history =
      state.history.map((i: any) => payload.id === i.id ? payload : i),
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
  }, 
  getters: {
    get_all_history: (state: any): IHistoryItem[] => state.history,
    get_edit_history: (state: any): number | null => state.edit_history,
  },
  actions: {
    get_history: (context: any) => {
      fetch_get(URL + '/get/history')
      .then((response: any) => {
        context.commit('set_all_history', response);
      })
    },
    create_history: (context: any, payload: IHistoryItem) => {
      fetch_post({
        url: URL,
        payload: {
          body: payload,
          action: '/history/create'
        }
      })
      .then((status: string) => {
        if(status) {
          context.commit('create_history', payload);
        }
      });
    },
    upd_history: (context: any, payload: any) => {
      fetch_post({
        url: URL,
        payload: {
          body: payload,
          action: '/history/update'
        }
      })
      .then((status: string) => {
        if(status) {
          context.commit('set_updated_history', payload);
        }
      });
    }
  }
}