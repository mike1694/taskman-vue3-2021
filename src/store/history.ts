import { ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchPost, fetchGet } from '@/api/fetchApi';
import type { HistoryItem } from '@/types/HistoryItem';

const URL = '/api';

export const useHistoryStore = defineStore('history', () => {
  const history = ref<HistoryItem[]>([]);
  const editHistoryId = ref<number | null>(null);
  const showHistoryCreate = ref(false);
  const confirmDeleteId = ref<number | null>(null);

  async function getHistory() {
    history.value = (await fetchGet(
      URL + '/get/history',
    )) as HistoryItem[];
  }

  async function createHistory(payload: HistoryItem) {
    const status = await fetchPost({
      url: URL,
      payload: {
        body: payload,
        action: '/history/create',
      },
    });

    if (!status.error) {
      history.value = [...history.value, payload];
    }
  }

  async function updateHistory(payload: HistoryItem) {
    const status = await fetchPost({
      url: URL,
      payload: {
        body: payload,
        action: '/history/update',
      },
    });

    if (!status.error) {
      history.value = history.value.map((i: HistoryItem) =>
        payload.id === i.id ? payload : i,
      );
    }
  }

  function deleteHistory(id: number) {
    confirmDeleteId.value = id;
  }

  async function confirmDelete() {
    const id = confirmDeleteId.value;
    if (id === null) return;

    const status = await fetchPost({
      url: URL,
      payload: {
        body: { id },
        action: '/history/delete',
      },
    });

    if (!status.error) {
      history.value = history.value.filter(
        (i: HistoryItem) => i.id !== id,
      );
      confirmDeleteId.value = null;
    }
  }

  function cancelDelete() {
    confirmDeleteId.value = null;
  }

  function toggleEditHistory(id: number | null) {
    editHistoryId.value = editHistoryId.value === id ? null : id;
  }

  function resetEditHistory() {
    editHistoryId.value = null;
  }

  function toggleHistoryCreate(payload?: boolean) {
    if (typeof payload === 'boolean') {
      showHistoryCreate.value = payload;
      return;
    }
    showHistoryCreate.value = !showHistoryCreate.value;
  }

  return {
    history,
    editHistoryId,
    showHistoryCreate,
    confirmDeleteId,
    getHistory,
    createHistory,
    updateHistory,
    deleteHistory,
    confirmDelete,
    cancelDelete,
    toggleEditHistory,
    resetEditHistory,
    toggleHistoryCreate,
  };
});
