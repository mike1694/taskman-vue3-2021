import { defineStore } from 'pinia';
import { fetch_post, fetch_get } from "@/api/fetch_api";
import ITaskItem from "@/types/ITaskItem";

const URL = '/api';

interface TasksState {
  tasks: ITaskItem[];
  editTaskId: number | null;
  confirmDeleteId: number | null;
}

export const useTasksStore = defineStore('tasks', {
  state: (): TasksState => ({
    tasks: [],
    editTaskId: null,
    confirmDeleteId: null
  }),
  actions: {
    async getTasks() {
      const tasks = await fetch_get(URL) as ITaskItem[];
      this.tasks = tasks;
    },
    async createTask(payload: ITaskItem) {
      const status = await fetch_post({
        url: URL,
        payload: {
          body: payload,
          action: '/task/create'
        }
      });

      if (!status.error) {
        this.tasks = [...this.tasks, payload];
      }
    },
    async updateTask(payload: ITaskItem) {
      const status = await fetch_post({
        url: URL,
        payload: {
          body: payload,
          action: '/task/update'
        }
      });

      if (!status.error) {
        this.tasks = this.tasks.map((i: ITaskItem) => payload.id === i.id ? payload : i);
      }
    },
    deleteTask(id: number) {
      this.confirmDeleteId = id;
    },
    async confirmDelete() {
      const id = this.confirmDeleteId;
      if (id === null) return;

      const status = await fetch_post({
        url: URL,
        payload: {
          body: { id },
          action: '/task/delete'
        }
      });

      if (!status.error) {
        this.tasks = this.tasks.filter((i: ITaskItem) => i.id !== id);
        this.confirmDeleteId = null;
      }
    },
    cancelDelete() {
      this.confirmDeleteId = null;
    },
    toggleEditTask(id: number | null) {
      this.editTaskId = this.editTaskId === id ? null : id;
    },
    resetEditTask() {
      this.editTaskId = null;
    }
  }
});
