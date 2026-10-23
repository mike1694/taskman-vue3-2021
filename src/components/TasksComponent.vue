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

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import TaskList from '@/components/TaskList.vue';
import { useTasksStore } from '@/store/tasks';
import { useTaskSettingsStore } from '@/store/task_settings';
import ITaskItem from '@/types/ITaskItem';
import ITasksObject from '@/types/ITasksObject';

const tasksStore = useTasksStore();
const taskSettingsStore = useTaskSettingsStore();

const { tasks } = storeToRefs(tasksStore);
const { finishedByDate, tasksDirection } = storeToRefs(taskSettingsStore);

const opened = computed<ITaskItem[]>(() => tasks.value.filter((i: ITaskItem) => !i.closed));
const closed = computed<ITaskItem[]>(() => tasks.value.filter((i: ITaskItem) => i.closed));

const isAllFinished = computed((): boolean => {
  return closed.value.length === tasks.value.length;
});

const hotTasks = computed<ITaskItem[]>(() => {
  const now = new Date();

  return opened.value
    .filter((i: ITaskItem) => i.type === 'hot')
    .sort((a: ITaskItem, b: ITaskItem): number => {
      const endA = new Date(a.maxDate + ' ' + a.maxTime);
      const endB = new Date(b.maxDate + ' ' + b.maxTime);
      const diffDateA = endA.getTime() - now.getTime();
      const diffDateB = endB.getTime() - now.getTime();

      return diffDateA - diffDateB;
    });
});

const currentTasks = computed<ITaskItem[]>(() => {
  return opened.value.filter((i: ITaskItem) => i.type === 'normal');
});

const finishedTasks = computed<ITaskItem[]>(() => {
  return closed.value;
});

const finishedTasksByDate = computed<ITasksObject>(() => {
  const res: ITasksObject = {};

  [...finishedTasks.value]
    .sort((a: ITaskItem, b: ITaskItem) =>
      new Date(b.closed_date as string).getTime() - new Date(a.closed_date as string).getTime()
    )
    .forEach((item: ITaskItem) => {
      const date: string = new Date(item.closed_date as string).toLocaleDateString();

      if (date in res) {
        res[date].push(item);
      } else {
        res[date] = [item];
      }
    });

  return res;
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
