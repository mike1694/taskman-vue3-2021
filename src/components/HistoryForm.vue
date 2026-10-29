<template>
  <div class="history-form">
    <div class="mb2">
      <input
        v-model="form.label"
        v-focus
        type="text"
        class="history-form__input field"
        autocomplete="off"
        placeholder="Заголовок"
      />
    </div>

    <div class="mb2">
      <textarea
        v-model="form.text"
        class="field"
        placeholder="Описание"
        rows="3"
        max-rows="6"
      >
      </textarea>
    </div>

    <div class="mb2">
      <input
        v-model="form.path"
        type="text"
        class="field"
        autocomplete="off"
        placeholder="Папка проекта"
      />
    </div>

    <div class="flex flex-wrap flex-between">
      <div class="flex-50-item">
        <input
          v-model="form.song_length"
          type="time"
          class="field mb2"
          autocomplete="off"
          title="Продолжительность"
          placeholder="Продолжительность"
        />
      </div>

      <div class="flex-50-item">
        <select v-model="form.status" class="field field--select mb2">
          <option
            v-for="item in typeOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.text }}
          </option>
        </select>
      </div>

      <div class="flex-50-item">
        <input
          v-model="form.date"
          class="field mb2"
          type="date"
          autocomplete="off"
          title="Дата создания"
          placeholder="Дата создания"
        />
      </div>
    </div>

    <button class="btn mr2 p5" @click="$emit('submit')">Ок</button>

    <button class="btn p5" @click="$emit('cancel')">Отмена</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';

import type { HistoryItem } from '@/types/HistoryItem';

const props = defineProps<{
  modelValue: HistoryItem;
}>();

const emit = defineEmits(['update:modelValue', 'submit', 'cancel']);

const form = reactive<HistoryItem>({
  ...props.modelValue,
  label: props.modelValue.label ?? '',
  text: props.modelValue.text ?? '',
  path: props.modelValue.path ?? '',
  date: props.modelValue.date ?? '',
  song_length: props.modelValue.song_length ?? '',
  status: props.modelValue.status || 'in_process',
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
  { deep: true },
);
</script>

<style scoped>
.history-form {
  list-style-type: none;
  margin: 5px;
  padding: 10px;
  border: 1px solid #d3d3d34d;
  border-radius: 5px;
  background-color: #f5f5f5;
}
</style>
