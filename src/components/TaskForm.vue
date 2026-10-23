<template>
  <div class="task-form">
    <div class="mb2">
      <input
        v-model="form.label"
        v-focus
        type="text"
        class="create-task-modal__header--input"
        autocomplete="off"
        placeholder="Название задачи"
      />
    </div>

    <div class="row">
      <div class="col">
        <select v-model="form.type" class="mb2">
          <option
            v-for="item in typeOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.text }}
          </option>
        </select>

        <div class="flex-center mb2">
          <label class="mr2">
            <input
              v-model="form.reopen"
              class="text-left"
              type="checkbox"
            />
            Переокрывать
          </label>

          <label v-if="form.maxTime">
            <input
              v-model="form.timer"
              class="text-left"
              type="checkbox"
            />
            Таймер
          </label>
        </div>
      </div>

      <div class="mb2 flex">
        <div class="w100 mr2">
          <input
            v-model="form.maxDate"
            :disabled="form.type !== 'hot'"
            type="date"
          />
        </div>

        <div class="w100">
          <input
            v-model="form.maxTime"
            :disabled="!form.maxDate || form.type !== 'hot'"
            type="time"
          />
        </div>
      </div>
    </div>

    <div class="mb2">
      <textarea
        v-model="form.info"
        placeholder="Описание"
        class="create-task-modal__header--textarea"
        rows="3"
        max-rows="6"
      >
      </textarea>
    </div>

    <div v-if="form.closed" class="mb2">
      <textarea
        v-model="form.result"
        placeholder="Результат"
        class="create-task-modal__header--textarea"
        rows="3"
        max-rows="6"
      >
      </textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';

import type { TaskItem } from '@/types/TaskItem';

const props = defineProps<{
  modelValue: TaskItem;
}>();

const emit = defineEmits(['update:modelValue']);

const form = reactive<TaskItem>({
  ...props.modelValue,
  label: props.modelValue.label ?? '',
  type: props.modelValue.type || 'normal',
  timer: props.modelValue.timer ?? false,
  info: props.modelValue.info ?? null,
  reopen: props.modelValue.reopen ?? true,
  maxDate: props.modelValue.maxDate ?? null,
  maxTime: props.modelValue.maxTime ?? null,
});

const typeOptions = [
  { value: 'normal', text: 'Обычная' },
  { value: 'hot', text: 'Срочная' },
];

watch(
  form,
  (val) => {
    emit('update:modelValue', val);
  },
  { deep: true },
);
</script>

<style scoped></style>
