<template>
  <div class="tasks-component">
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
    AllTasks: function(): any {
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
    hotTasks: function(): [] {
      return this.AllTasks.opened
        .filter((i: any) => i.type === 'hot')
        .sort((a: any, b: any): number => {
          let now = new Date();
          let endA = new Date(a.maxDate + ' ' + a.maxTime);
          let endB = new Date(b.maxDate + ' ' + b.maxTime);
          let diffDateA = endA.getTime() - now.getTime();
          let diffDateB = endB.getTime() - now.getTime();

          return diffDateA - diffDateB;
        });
    },
    currentTasks: function(): [] {
      return this.AllTasks.opened.filter((i: any) => i.type === 'normal');
    },
    finishedTasks: function(): [] {
      return this.AllTasks.closed;
    },
    finishedTasksByDate: function(): any {
      interface FinisheSortedTasks {
        [key: string]: any
      }
      interface FinishedSort {
        closed_date: string,
      }

      let res: FinisheSortedTasks = {};

      [...this.finishedTasks]
      .sort((a: FinishedSort, b: FinishedSort) =>
        new Date(b.closed_date).getTime() - new Date(a.closed_date).getTime()
      )
      .forEach((item: FinishedSort) => {
        let date: string = new Date(item.closed_date).toLocaleDateString();

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
<style scoped lang="scss">
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
