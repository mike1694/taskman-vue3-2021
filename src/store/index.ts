import { createPinia, type Pinia } from 'pinia';

const pinia: Pinia = createPinia();

export default pinia;
export { useTasksStore } from './tasks';
export { useHistoryStore } from './history';
export { useTaskSettingsStore } from './task_settings';
