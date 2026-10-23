import { ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchPost, fetchGet } from '@/api/fetchApi';
import type { TaskItem } from '@/types/TaskItem';

const URL = '/api';

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<TaskItem[]>([]);
  const editTaskId = ref<number | null>(null);
  const confirmDeleteId = ref<number | null>(null);

  async function getTasks() {
    tasks.value = (await fetchGet(URL)) as TaskItem[];
  }

  async function createTask(payload: TaskItem) {
    const status = await fetchPost({
      url: URL,
      payload: {
        body: payload,
        action: '/task/create',
      },
    });

    if (!status.error) {
      tasks.value = [...tasks.value, payload];
    }
  }

  async function updateTask(payload: TaskItem) {
    const status = await fetchPost({
      url: URL,
      payload: {
        body: payload,
        action: '/task/update',
      },
    });

    if (!status.error) {
      tasks.value = tasks.value.map((i: TaskItem) =>
        payload.id === i.id ? payload : i,
      );
    }
  }

  function deleteTask(id: number) {
    confirmDeleteId.value = id;
  }

  async function confirmDelete() {
    const id = confirmDeleteId.value;
    if (id === null) return;

    const status = await fetchPost({
      url: URL,
      payload: {
        body: { id },
        action: '/task/delete',
      },
    });

    if (!status.error) {
      tasks.value = tasks.value.filter((i: TaskItem) => i.id !== id);
      confirmDeleteId.value = null;
    }
  }

  function cancelDelete() {
    confirmDeleteId.value = null;
  }

  function toggleEditTask(id: number | null) {
    editTaskId.value = editTaskId.value === id ? null : id;
  }

  function resetEditTask() {
    editTaskId.value = null;
  }

  return {
    tasks,
    editTaskId,
    confirmDeleteId,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    confirmDelete,
    cancelDelete,
    toggleEditTask,
    resetEditTask,
  };
});
