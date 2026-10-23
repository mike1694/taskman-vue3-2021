import { onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useTasksStore } from '@/store/tasks';

export function useTasksKeyup(): void {
  const route = useRoute();
  const tasksStore = useTasksStore();

  const keyupHandler = (e: KeyboardEvent): void => {
    if (route.path !== '/') {
      return;
    }
    if (e.target instanceof HTMLInputElement && e.code !== 'Escape') {
      return;
    }
    if (
      e.target instanceof HTMLTextAreaElement &&
      e.code !== 'Escape'
    ) {
      return;
    }

    switch (e.code) {
      case 'Escape':
        tasksStore.resetEditTask();
        break;
    }
  };

  onMounted(() => {
    document.body.addEventListener('keyup', keyupHandler);
  });
  onBeforeUnmount(() => {
    document.body.removeEventListener('keyup', keyupHandler);
  });
}
