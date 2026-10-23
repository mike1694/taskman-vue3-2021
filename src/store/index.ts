import { createPinia, type Pinia } from 'pinia';

export const pinia: Pinia = createPinia();

export { useTasksStore } from '@/store/tasks';
export { useHistoryStore } from '@/store/history';
export { useTaskSettingsStore } from '@/store/taskSettings';
