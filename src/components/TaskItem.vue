<template>
  <div class="task-item">
    <label class="task-item__container">
      <input
        :checked="props.item.closed"
        :disabled="!props.item.reopen && props.item.closed"
        type="checkbox"
        class="task-item__checkbox"
        @click="$emit('click', props.item.id)"
      />

      <div class="task-item__label">{{ props.item.label }}</div>

      <div
        v-if="props.item.type === 'hot'"
        class="task-item__end-date info-label"
      >
        {{ getEndDate }}
      </div>
    </label>

    <div class="task-item__content">
      <div
        v-if="showInfo && props.item.info"
        class="text-left task-item__info-block primary-label"
      >
        <b>Описание:</b> {{ props.item.info }}
      </div>

      <div
        v-if="props.item.closed && props.item.result"
        class="text-left task-item__result success-label"
      >
        <b>Итог:</b> {{ props.item.result }}
      </div>

      <!-- <task-timer v-if="tasksTimer && item.timer && !item.closed"
        :item="item">
      </task-timer> -->

      <div v-if="showDate" class="task-item__date-block">
        {{ getCreatedDate }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import type { TaskItem } from '@/types/TaskItem';
import { useTaskSettingsStore } from '@/store/taskSettings';
import { getFormatDateTime } from '@/api/dateTimeFormat';

const props = defineProps<{
  item: TaskItem;
}>();

const taskSettingsStore = useTaskSettingsStore();
const { showInfo, showDate, tasksTimer } =
  storeToRefs(taskSettingsStore);

const dateType = ['date', 'date-time'];

const getCreatedDate = computed((): string => {
  switch (dateType[0]) {
    case 'date':
      return new Date(props.item.created).toLocaleDateString();
    case 'date-time':
      return new Date(props.item.created).toLocaleString();
    default:
      return props.item.created;
  }
});

const getEndDate = computed((): string => {
  const date = new Date(
    props.item.maxDate + ' ' + (props.item.maxTime || '00:00'),
  );

  return getFormatDateTime(date);
});
</script>

<style scoped>
.finished-tasks h4,
.finished-tasks-by-date h4 {
  color: gray;
}
.finished-tasks label,
.finished-tasks-by-date label {
  color: gray;
  text-decoration: line-through;
}

.task-item {
  min-height: 30px;
}

.task-item__label {
  flex-grow: 2;
}

.task-item__container {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;
  margin: 0;
}
.task-item__checkbox {
  cursor: pointer;
  margin-right: 5px;
}

.task-item__date-block {
  color: lightgray;
  font-weight: bold;
  font-size: 12px;
  text-align: right;
}

.task-item__info-block,
.task-item__result {
  margin-top: 5px;
  padding: 5px;
}
</style>
