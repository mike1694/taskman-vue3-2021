<template>
  <div class="tasks-component mb4">
    <div class="tasks-content"
      :style="{'flex-direction': tasksDirection ? 'row' : 'column'}">
      <task-list
        key="hot-tasks"
        class-name="hot-tasks"
        title="Важные"
        
        :data="hotTasks"
      >
      </task-list>

      <task-list
        key="current-tasks"
        class-name="current-tasks"
        title="Текущие"
        :data="currentTasks"
      >
      </task-list>

      <task-list v-if="!finishedByDate"
        class-name="finished-tasks"
        title="Завершенные"
        :data="finishedTasks"
      >
      </task-list>

      <task-list v-else
        class-name="finished-tasks-by-date"
        v-for="(key, date) in finishedTasksByDate"
        :key="'finished-tasks' + date"
        :data="finishedTasksByDate[date]"
        :title="date"
      >
      </task-list>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import TaskList from '@/components/TaskList.vue';
import { mapGetters } from 'vuex';

import ITaskItem from '@/types/ITaskItem';
import ITasksObject from '@/types/ITasksObject';

export default defineComponent({
  name: 'TasksComponent',
  components: {TaskList},
  computed: {
    ...mapGetters('tasks', {
      tasks: 'get_all_tasks'
    }),
    ...mapGetters('task_settings', {
      hideMessages: 'get_hide_messages',
      finishedByDate: 'get_finished_by_date',
      tasksDirection: 'get_tasks_direction'
    }),
    isAllFinished: function(): boolean {
      return this.finishedTasks.length === this.tasks.length;
    },
    AllTasks: function(): ITasksObject {
      let opened = [];
      let closed = [];

      for (let item of this.tasks) {
        if(item.closed) {
          closed.push(item);
        } else {
          opened.push(item);
        }
      }

      return {opened, closed};
    },
    hotTasks: function(): ITaskItem[] {
      return this.AllTasks.opened
        .filter((i) => i.type === 'hot')
        .sort((a, b): number => {
          let now = new Date();
          let endA = new Date(a.maxDate + ' ' + a.maxTime);
          let endB = new Date(b.maxDate + ' ' + b.maxTime);
          let diffDateA = endA.getTime() - now.getTime();
          let diffDateB = endB.getTime() - now.getTime();

          return diffDateA - diffDateB;
        });
    },
    currentTasks: function(): ITaskItem[] {
      return this.AllTasks.opened.filter((i) => i.type === 'normal');
    },
    finishedTasks: function(): ITaskItem[] {
      return this.AllTasks.closed;
    },
    finishedTasksByDate: function(): ITasksObject {
      let res: ITasksObject = {};

      [...this.finishedTasks as ITaskItem[]]
      .sort((a, b) =>
        new Date(b.closed_date as string).getTime() - new Date(a.closed_date as string).getTime()
      )
      .forEach((item: ITaskItem) => {
        let date: string = new Date(item.closed_date as string).toLocaleDateString();

        if(date in res) {
            res[date].push(item);
        } else {
            res[date] = [item];
        }
      });

      return res;
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
