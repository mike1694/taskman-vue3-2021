<template>
  <div class="history-form">
    <div class="mb2">
      <input
        type="text"
        v-focus
        class="create-task-modal__header--input"
        v-model="form.label"
        autocomplete="off"
        placeholder="Заголовок">
    </div>

    <div class="mb2">
      <textarea
        v-model="form.text"
        placeholder="Описание"
        rows="3"
        max-rows="6">
      </textarea>
    </div>

    <div class="mb2">
      <input
        type="text"
        v-model="form.path"
        autocomplete="off"
        placeholder="Папка проекта">
    </div>

    <div class="flex flex-wrap flex-between">
      <div class="flex-50-item">
        <input
          type="time"
          class="mb2"
          v-model="form.song_length"
          autocomplete="off"
          title="Продолжительность"
          placeholder="Продолжительность">
      </div>
      
      <div class="flex-50-item">
        <select class="mb2"
          v-model="form.status">
          <option v-for="item in typeOptions"
            :key="item.value"
            :value="item.value">
            {{ item.text }}
          </option>
        </select>
      </div>
      
      <div class="flex-50-item">
        <input
          class="mb2"
          type="date"
          v-model="form.date"
          autocomplete="off"
          title="Дата создания"
          placeholder="Дата создания">
      </div>
    </div>

    <button class="mr2 p5" @click="$emit('submit')">Ок</button>
    <button class="p5" @click="$emit('cancel')">Отмена</button>
  </div>
</template>

<script setup lang="ts">
import { PropType, reactive, watch } from 'vue';
import IHistoryItem from '@/types/IHistoryItem';

const props = defineProps({
  modelValue: {
    type: Object as PropType<IHistoryItem>,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'submit', 'cancel']);

const form = reactive<IHistoryItem>({
  ...props.modelValue,
  label: props.modelValue.label ?? '',
  text: props.modelValue.text ?? '',
  path: props.modelValue.path ?? '',
  date: props.modelValue.date ?? '',
  song_length: props.modelValue.song_length ?? '',
  status: props.modelValue.status || 'in_process'
});

const typeOptions = [
  { value: 'created', text: 'Создано' },
  { value: 'in_process', text: 'В работе' },
  { value: 'finished', text: 'Закончено' },
];

watch(
  form,
  (val) => {
    emit('update:modelValue', val);
  },
  { deep: true }
);
</script>

<style scoped>
  .history-form {
    list-style-type: none;
    margin: 5px;
    padding: 10px;
    border: 1px solid #d3d3d34d;
    border-radius: 5px;
    padding: 10px;
    background-color: #f5f5f5;
  }
</style>