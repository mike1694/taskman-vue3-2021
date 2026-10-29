<template>
  <div class="task-form">
    <div class="mb2">
      <input
        v-model="form.label"
        v-focus
        type="text"
        class="task-form__input field"
        autocomplete="off"
        placeholder="Название задачи"
      />
    </div>

    <div>
      <div>
        <select v-model="form.type" class="field field--select mb2">
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
            <input v-model="form.reopen" type="checkbox" />
            Переокрывать
          </label>

          <label v-if="form.maxTime">
            <input v-model="form.timer" type="checkbox" />
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
            class="field"
          />
        </div>

        <div class="w100">
          <input
            v-model="form.maxTime"
            :disabled="!form.maxDate || form.type !== 'hot'"
            type="time"
            class="field"
          />
        </div>
      </div>
    </div>

    <p v-if="isHotWithoutDate" class="task-form__error">
      Для срочной задачи укажите дату
    </p>

    <div class="mb2">
      <textarea
        v-model="form.info"
        placeholder="Описание"
        class="task-form__textarea field"
        rows="3"
        max-rows="6"
      >
      </textarea>
    </div>

    <div v-if="form.closed" class="mb2">
      <textarea
        v-model="form.result"
        placeholder="Результат"
        class="task-form__textarea field"
        rows="3"
        max-rows="6"
      >
      </textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

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

const isHotWithoutDate = computed((): boolean => {
  return form.type === 'hot' && !form.maxDate;
});

watch(
  () => form.maxDate,
  (val) => {
    if (!val) {
      form.maxDate = null;
      form.maxTime = null;
      form.type = 'normal';
    }
  },
);

watch(
  form,
  (val) => {
    emit('update:modelValue', val);
  },
  { deep: true },
);
</script>

<style scoped>
.task-form__error {
  color: #dc3545;
  font-size: 14px;
}
</style>
