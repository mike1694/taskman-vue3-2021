import { onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

export default function useAppRouteKeyup(): void {
  const router = useRouter();

  const keyupHandler = (e: KeyboardEvent): void => {
    if (e.target instanceof HTMLInputElement && e.code === 'Escape') {
      return;
    }
    if (e.target instanceof HTMLTextAreaElement && e.code === 'Escape') {
      return;
    }

    switch (e.code) {
      case 'KeyH':
        if (e.target instanceof HTMLInputElement) {
          return;
        }
        if (e.target instanceof HTMLTextAreaElement) {
          return;
        }
        router.push('/history');
        break;

      case 'NumpadAdd':
      case 'Equal':
        router.push('/create');
        break;
      case 'Escape':
        router.push('/');
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