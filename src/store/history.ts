import { defineStore } from 'pinia';
import { fetch_post, fetch_get } from "@/api/fetch_api";
import IHistoryItem from "@/types/IHistoryItem";

const URL = '/api';

interface HistoryState {
  history: IHistoryItem[];
  editHistoryId: number | null;
  showHistoryCreate: boolean;
  confirmDeleteId: number | null;
}

export const useHistoryStore = defineStore('history', {
  state: (): HistoryState => ({
    history: [],
    editHistoryId: null,
    showHistoryCreate: false,
    confirmDeleteId: null
  }),
  actions: {
    async getHistory() {
      const history = await fetch_get(URL + '/get/history') as IHistoryItem[];
      this.history = history;
    },
    async createHistory(payload: IHistoryItem) {
      const status = await fetch_post({
        url: URL,
        payload: {
          body: payload,
          action: '/history/create'
        }
      });

      if (!status.error) {
        this.history = [...this.history, payload];
      }
    },
    async updateHistory(payload: IHistoryItem) {
      const status = await fetch_post({
        url: URL,
        payload: {
          body: payload,
          action: '/history/update'
        }
      });

      if (!status.error) {
        this.history = this.history.map((i: IHistoryItem) => payload.id === i.id ? payload : i);
      }
    },
    deleteHistory(id: number) {
      this.confirmDeleteId = id;
    },
    async confirmDelete() {
      const id = this.confirmDeleteId;
      if (id === null) return;

      const status = await fetch_post({
        url: URL,
        payload: {
          body: { id },
          action: '/history/delete'
        }
      });

      if (!status.error) {
        this.history = this.history.filter((i: IHistoryItem) => i.id !== id);
        this.confirmDeleteId = null;
      }
    },
    cancelDelete() {
      this.confirmDeleteId = null;
    },
    toggleEditHistory(id: number | null) {
      this.editHistoryId = this.editHistoryId === id ? null : id;
    },
    resetEditHistory() {
      this.editHistoryId = null;
    },
    toggleHistoryCreate(payload?: boolean) {
      if (typeof payload === 'boolean') {
        this.showHistoryCreate = payload;
        return;
      }
      this.showHistoryCreate = !this.showHistoryCreate;
    }
  }
});
