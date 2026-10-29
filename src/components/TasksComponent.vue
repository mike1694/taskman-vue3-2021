<template>
  <div class="tasks-component mb4">
    <div
      :style="{ 'flex-direction': tasksDirection ? 'row' : 'column' }"
      class="tasks-component__content"
    >
      <TaskList
        key="hot-tasks"
        :data="hotTasks"
        class-name="task-list--hot"
        title="Важные"
      >
      </TaskList>

      <TaskList
        key="current-tasks"
        :data="currentTasks"
        class-name="task-list--current"
        title="Текущие"
      >
      </TaskList>

      <TaskList
        v-if="!finishedByDate"
        :data="finishedTasks"
        class-name="task-list--finished"
        title="Завершенные"
      >
      </TaskList>

      <TaskList
        v-for="(key, date) in finishedTasksByDate"
        v-else
        :key="'finished-tasks' + date"
        :data="finishedTasksByDate[date]"
        :title="date"
        class-name="task-list--finished-by-date"
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
  return opened.value
    .filter((i: TaskItem) => i.type === 'hot')
    .toSorted((a: TaskItem, b: TaskItem): number => {
      const dateA = a.maxDate ?? '';
      const dateB = b.maxDate ?? '';

      return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
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
