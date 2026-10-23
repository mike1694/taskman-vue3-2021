<template>
  <div class="confirm-dialog-overlay" v-if="visible">
    <div class="confirm-dialog">
      <div class="confirm-dialog__content">
        <p>{{ message }}</p>
      </div>
      <div class="confirm-dialog__actions">
        <button class="confirm-dialog__btn confirm-dialog__btn--yes" @click="confirm">Да</button>
        <button class="confirm-dialog__btn confirm-dialog__btn--no" @click="cancel">Нет</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Вы уверены, что хотите удалить?'
  }
});

const emit = defineEmits(['confirm', 'cancel']);

function confirm() {
  emit('confirm');
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped>
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.confirm-dialog {
  background: white;
  border-radius: 8px;
  padding: 24px;
  min-width: 300px;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.confirm-dialog__content {
  margin-bottom: 20px;
}

.confirm-dialog__content p {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.confirm-dialog__actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.confirm-dialog__btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s;
}

.confirm-dialog__btn--yes {
  background: #dc3545;
  color: white;
}

.confirm-dialog__btn--yes:hover {
  background: #c82333;
}

.confirm-dialog__btn--no {
  background: #6c757d;
  color: white;
}

.confirm-dialog__btn--no:hover {
  background: #5a6268;
}
</style>
