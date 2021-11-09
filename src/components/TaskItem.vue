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

<script lang="ts">
import ITaskItem from '@/types/ITaskItem';
import IDateOptions from '@/types/IDateOptions';
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
      let options: IDateOptions = {
        weekday: 'long',
        day: 'numeric',
        // year: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: 'numeric'
      };

      return new Intl.DateTimeFormat(undefined, options)
        .format(maxDate);
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