<template>
  <div class="task-form">
    <div class="mb2">
      <input
        type="text"
        v-focus
        class="create-task-modal__header--input"
        v-model="label"
        autocomplete="off"
        placeholder="Название задачи">
    </div>

    <div class="row">
      <div class="col">

        <select
          class="mb2"
          v-model="type">
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
              v-model="reopen">
              Переокрывать
          </label>

          <label v-if="maxTime">
            <input class="text-left"
              type="checkbox"
              v-model="timer"
            >
              Таймер
          </label>
        </div>
          
      </div>
      <div class="mb2 flex">
        <input type="date"
          class="mb2"
          v-model="maxDate"
          :disabled="type !== 'hot'"
        >
        <input class="ml2"
          type="time"
          v-model="maxTime"
          :disabled="!maxDate || type !== 'hot'"
        >
      </div>
    </div>
    
    <div class="mb2">
      <textarea
        v-model="info"
        placeholder="Описание"
        class="create-task-modal__header--textarea"
        rows="3"
        max-rows="6">
      </textarea>
    </div>

    <div class="mb2" v-if="modelValue.closed">
      <textarea
        v-model="result"
        placeholder="Результат"
        class="create-task-modal__header--textarea"
        rows="3"
        max-rows="6">
      </textarea>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ITaskItem from '@/types/ITaskItem';

export default defineComponent({
  name: 'TaskForm',
  props: {
    modelValue: {
      type: Object as PropType<ITaskItem>,
      required: true
    },
  },
  data() {
    return {
      typeOptions: [
        { value: 'normal', text: 'Обычная' },
        { value: 'hot', text: 'Срочная' },
      ]
    }
  },
  computed: {
    label: {
      get: function() {return this.modelValue.label; },
      set(val: string) {this.$emit('update:modelValue', {...this.modelValue, label: val});}
    },
    type: {
      get: function() {return this.modelValue.type; },
      set(val: string) {this.$emit('update:modelValue', {...this.modelValue, type: val});}
    },
    timer: {
      get: function() {return this.modelValue.timer; },
      set(val: boolean) {this.$emit('update:modelValue', {...this.modelValue, timer: val});}
    },
    maxTime: {
      get: function() {return this.modelValue.maxTime; },
      set(val: string | null) {this.$emit('update:modelValue', {...this.modelValue, maxTime: val});}
    },
    maxDate: {
      get: function() {return this.modelValue.maxDate; },
      set(val: string | null) {this.$emit('update:modelValue', {...this.modelValue, maxDate: val});}
    },
    info: {
      get: function() {return this.modelValue.info; },
      set(val: string) {this.$emit('update:modelValue', {...this.modelValue, info: val});}
    },
    result: {
      get: function() {return this.modelValue.result; },
      set(val: string) {this.$emit('update:modelValue', {...this.modelValue, result: val});}
    },
    reopen: {
      get: function() {return this.modelValue.reopen; },
      set(val: boolean) {this.$emit('update:modelValue', {...this.modelValue, reopen: val});}
    },
  }
});
</script>

<style scoped>

</style>