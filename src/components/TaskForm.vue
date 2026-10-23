<template>
  <div class="task-form">
    <div class="mb2">
      <input
        type="text"
        v-focus
        class="create-task-modal__header--input"
        v-model="form.label"
        autocomplete="off"
        placeholder="Название задачи">
    </div>

    <div class="row">
      <div class="col">

        <select
          class="mb2"
          v-model="form.type">
          <option v-for="item in typeOptions"
            :key="item.value"
            :value="item.value">
            {{ item.text }}
          </option>
        </select>
        
        <div class="flex-center mb2">
          <label class="mr2">
            <input class="text-left"
              type="checkbox"
              v-model="form.reopen">
              Переокрывать
          </label>

          <label v-if="form.maxTime">
            <input class="text-left"
              type="checkbox"
              v-model="form.timer"
            >
              Таймер
          </label>
        </div>
          
      </div>
      <div class="mb2 flex">
        <div class="w100 mr2">
          <input type="date"
            v-model="form.maxDate"
            :disabled="form.type !== 'hot'"
          >
        </div>
        
        <div class="w100">
          <input
            type="time"
            v-model="form.maxTime"
            :disabled="!form.maxDate || form.type !== 'hot'"
          >
        </div>
      </div>
    </div>
    
    <div class="mb2">
      <textarea
        v-model="form.info"
        placeholder="Описание"
        class="create-task-modal__header--textarea"
        rows="3"
        max-rows="6">
      </textarea>
    </div>

    <div class="mb2" v-if="form.closed">
      <textarea
        v-model="form.result"
        placeholder="Результат"
        class="create-task-modal__header--textarea"
        rows="3"
        max-rows="6">
      </textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, reactive, watch } from 'vue';
import ITaskItem from '@/types/ITaskItem';

const props = defineProps({
  modelValue: {
    type: Object as PropType<ITaskItem>,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const form = reactive<ITaskItem>({
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
  { deep: true }
);
</script>

<style scoped>

</style>