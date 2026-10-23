<template>
  <div class="task-item">
        
    <label class="task-item__container">
    <input type="checkbox"
        class="task-item__checkbox"
        :checked="item.closed"
        @click="$emit('click', item.id)"
        :disabled="!item.reopen && item.closed">
      <div class="task-item__label">{{ item.label }}</div>
      <div v-if="item.type === 'hot'" class="task-item__end-date info-label">
        {{ getEndDate }}
      </div>
    </label>

    <div class="task-item__content">
      <div v-if="showInfo && item.info"
        class="text-left task-item__info-block primary-label">
            <b>Описание:</b> {{ item.info }}
      </div>

      <div v-if="item.closed && item.result"
        class="text-left task-item__result success-label">
            <b>Итог:</b> {{ item.result }}
      </div>
        
      <!-- <task-timer v-if="tasksTimer && item.timer && !item.closed"
        :item="item">
      </task-timer> -->

      <div class="task-item__date-block"
        v-if="showDate">
        {{ getCreatedDate }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { storeToRefs } from 'pinia';
import ITaskItem from '@/types/ITaskItem';
import { useTaskSettingsStore } from '@/store/task_settings';
import { getFormatDateTime } from '@/api/date_time_format';

const props = defineProps({
  item: {
    type: Object as PropType<ITaskItem>,
    required: true
  }
});

const taskSettingsStore = useTaskSettingsStore();
const { showInfo, showDate, tasksTimer } = storeToRefs(taskSettingsStore);

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
    props.item.maxDate + ' ' + (props.item.maxTime || '00:00')
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

.task-item__date-block  {
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