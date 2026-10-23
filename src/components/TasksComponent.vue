<template>
  <div class="tasks-component mb4">
    <div
      :style="{ 'flex-direction': tasksDirection ? 'row' : 'column' }"
      class="tasks-content"
    >
      <TaskList
        key="hot-tasks"
        :data="hotTasks"
        class-name="hot-tasks"
        title="Важные"
      >
      </TaskList>

      <TaskList
        key="current-tasks"
        :data="currentTasks"
        class-name="current-tasks"
        title="Текущие"
      >
      </TaskList>

      <TaskList
        v-if="!finishedByDate"
        :data="finishedTasks"
        class-name="finished-tasks"
        title="Завершенные"
      >
      </TaskList>

      <TaskList
        v-for="(key, date) in finishedTasksByDate"
        v-else
        :key="'finished-tasks' + date"
        :data="finishedTasksByDate[date]"
        :title="date"
        class-name="finished-tasks-by-date"
      >
      </TaskList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useTasksStore } from '@/store/tasks';
import { useTaskSettingsStore } from '@/store/taskSettings';
import type { TaskItem } from '@/types/TaskItem';
import type { TasksObject } from '@/types/TasksObject';

import TaskList from '@/components/TaskList.vue';

const tasksStore = useTasksStore();
const taskSettingsStore = useTaskSettingsStore();

const { tasks } = storeToRefs(tasksStore);
const { finishedByDate, tasksDirection } =
  storeToRefs(taskSettingsStore);

const opened = computed<TaskItem[]>(() =>
  tasks.value.filter((i: TaskItem) => !i.closed),
);
const closed = computed<TaskItem[]>(() =>
  tasks.value.filter((i: TaskItem) => i.closed),
);

const isAllFinished = computed((): boolean => {
  return closed.value.length === tasks.value.length;
});

const hotTasks = computed<TaskItem[]>(() => {
  const now = new Date();

  return opened.value
    .filter((i: TaskItem) => i.type === 'hot')
    .toSorted((a: TaskItem, b: TaskItem): number => {
      const endA = new Date(a.maxDate + ' ' + a.maxTime);
      const endB = new Date(b.maxDate + ' ' + b.maxTime);
      const diffDateA = endA.getTime() - now.getTime();
      const diffDateB = endB.getTime() - now.getTime();

      return diffDateA - diffDateB;
    });
});

const currentTasks = computed<TaskItem[]>(() => {
  return opened.value.filter((i: TaskItem) => i.type === 'normal');
});

const finishedTasks = computed<TaskItem[]>(() => {
  return closed.value;
});

const finishedTasksByDate = computed<TasksObject>(() => {
  const res: TasksObject = {};

  finishedTasks.value
    .toSorted(
      (a: TaskItem, b: TaskItem) =>
        new Date(b.closed_date as string).getTime() -
        new Date(a.closed_date as string).getTime(),
    )
    .forEach((item: TaskItem) => {
      const date: string = new Date(
        item.closed_date as string,
      ).toLocaleDateString();

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
