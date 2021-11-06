<template>
  <div class="task-item">
        
    <label class="task-item__container">
    <input type="checkbox"
        class="task-item__checkbox"
        :checked="item.closed"
        @click="$emit('click', item.id)"
        :disabled="!item.reopen && item.closed">
      <div class="task-item__label">{{ item.label }}</div>
      <div v-if="item.type === 'hot'" class="task-item__end-date text-right">
        {{ getEndDate }}
      </div>
    </label>

    <div class="task-item__content">
      <div v-if="showInfo && item.info"
        class="text-left mb-2 task-item__info-block"
        style="
          font-size: 12px;
          padding: 5px;
          margin: 0;
        "
        show
        variant="primary">
            <b>Описание:</b> {{ item.info }}
      </div>

      <div v-if="item.closed && item.result"
        class="text-left"
        style="
          font-size: 12px;
          padding: 5px;
          margin: 0;
        "
        show
        variant="success">
            <b>Итог:</b> {{ item.result }}
      </div>
        
      <!-- <task-timer v-if="tasksTimer && item.timer && !item.closed"
        :item="item">
      </task-timer> -->

      <div class="date-block"
        v-if="showDate">
        {{ getCreatedDate }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ITaskItem from '@/types/ITaskItem';
import { defineComponent, PropType } from 'vue';
import {mapGetters} from 'vuex';

// import TaskTimer from '@/components/TaskTimer.vue';

export default defineComponent({
  name: 'TaskItem',
  // components: { TaskTimer },
  props: {
    item: {
      type: Object as PropType<ITaskItem>,
      required: true
    }
  },
  data() {
    return {
      dateType: ['date', 'date-time'],
    };
  },
  computed: {
    ...mapGetters('task_settings', {
      showInfo: 'get_show_info',
      showDate: 'get_show_date',
      tasksTimer: 'get_tasks_timer'
    }),
    getCreatedDate: function(): string {
      switch(this.dateType[0]) {
        case 'date':
          return new Date(this.item.created).toLocaleDateString();
        case 'date-time':
          return new Date(this.item.created).toLocaleString();
        default:
          return this.item.created;
      }
    },
    getEndDate: function(): string {
      let maxDate = new Date(
          this.item.maxDate + ' ' + (this.item.maxTime || '00:00')
      );
      let date = maxDate.toLocaleDateString();
      let time = maxDate.toLocaleTimeString().split(':');

      return `${date} ${time[0]}:${time[1]}`;
    }
  }
})
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

.task-item__content .info-block {
  color: #28a745;
  text-align: justify;
  font-size: 14px;
}

.task-item__label {
  flex-grow: 2;
}

.task-item__end-date {
  color: gray;
  font-size: 12px;
  width: 150px;
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

.date-block  {
  color: lightgray;
  font-weight: bold;
  font-size: 12px;
  text-align: right;
}

.task-item__info-block {
  font-size: 12px;
  padding: 5px;
  margin: 0;
}
</style>