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

    <div class="flex mb2">
      <select class="mr2"
        v-model="form.status">
        <option v-for="item in typeOptions"
          :key="item.value"
          :value="item.value">
          {{ item.text }}
        </option>
      </select>

      <input
        type="text"
        v-model="form.year"
        autocomplete="off"
        placeholder="Год проекта">
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

    <button class="mr2 p5" @click="$emit('submit')">Ок</button>
    <button class="p5" @click="$emit('cancel')">Отмена</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import IHistoryItem from '@/types/IHistoryItem';

export default defineComponent({
  name: 'TaskForm',
  props: {
    modelValue: {
      type: Object as PropType<IHistoryItem>,
      required: true
    },
  },
  data() {
    return {
      form: this.modelValue || {
        type: 'log',
        label: '',
        text: '',
        path: '',
        year: '',
        status: 'created'
      },
      typeOptions: [
        { value: 'created', text: 'Создано' },
        { value: 'in_process', text: 'В работе' },
        { value: 'finished', text: 'Закончено' },
      ]
    }
  },
  watch: {
    form: {
      handler: function(val) {
        this.$emit('update:modelValue', val);
      },
      deep: true
    },
  }
});
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