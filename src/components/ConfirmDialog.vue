<template>
  <div v-if="props.visible" class="confirm-dialog-overlay">
    <div class="confirm-dialog">
      <button
        class="confirm-dialog__close"
        aria-label="Закрыть"
        @click="cancel"
      >
        ×
      </button>

      <div class="confirm-dialog__content">
        <p class="confirm-dialog__message">{{ props.message }}</p>
      </div>

      <div class="confirm-dialog__actions">
        <button
          class="btn confirm-dialog__btn confirm-dialog__btn--yes"
          @click="confirm"
        >
          Да
        </button>

        <button
          class="btn confirm-dialog__btn confirm-dialog__btn--no"
          @click="cancel"
        >
          Нет
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: 'Вы уверены, что хотите удалить?',
  },
});

const emit = defineEmits(['confirm', 'cancel']);

function confirm() {
  emit('confirm');
}

function cancel() {
  emit('cancel');
}

const keyupHandler = (e: KeyboardEvent): void => {
  if (!props.visible || e.code !== 'Escape') {
    return;
  }

  e.stopImmediatePropagation();
  emit('cancel');
};

onMounted(() => {
  document.body.addEventListener('keyup', keyupHandler);
});

onBeforeUnmount(() => {
  document.body.removeEventListener('keyup', keyupHandler);
});
</script>

<style scoped>
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.confirm-dialog {
  position: relative;
  width: 100%;
  max-width: 400px;
  padding: 24px;
  background: #f5f5f5;
  border: 1px solid #d3d3d34d;
  border-radius: 5px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.confirm-dialog__close {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #666;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.confirm-dialog__close:hover {
  background: #e0e0e0;
  color: #333;
}

.confirm-dialog__content {
  margin-bottom: 20px;
  padding-right: 16px;
}

.confirm-dialog__message {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  word-break: break-word;
}

.confirm-dialog__actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.confirm-dialog__btn {
  min-width: 80px;
  padding: 8px 20px;
  font-size: 14px;
}

.confirm-dialog__btn--yes {
  background: #dc3545;
}

.confirm-dialog__btn--yes:hover {
  background: #c82333;
}

.confirm-dialog__btn--no {
  background: #6c757d;
}

.confirm-dialog__btn--no:hover {
  background: #5a6268;
}
</style>
