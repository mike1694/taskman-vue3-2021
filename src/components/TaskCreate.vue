<template>
  <div class="task-create">
    <h4 class="mb2">Создать новую задачу</h4>

    <TaskForm v-model="vmodel"> </TaskForm>

    <button class="mr2 p5" @click="addTask">Ок</button>

    <button class="p5" @click="resetModal">Отмена</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { useTasksStore } from '@/store/tasks';
import type { TaskItem } from '@/types/TaskItem';

import TaskForm from '@/components/TaskForm.vue';

const router = useRouter();
const route = useRoute();
const tasksStore = useTasksStore();

const vmodel = ref<TaskItem>({
  type: 'normal',
  label: '',
  info: '',
  reopen: true,
  maxDate: null,
  maxTime: null,
  timer: false,
} as TaskItem);

watch(
  () => vmodel.value.type,
  (val) => {
    const tmpDate: string[] = new Date().toJSON().split('T');

    switch (val) {
      case 'hot':
        vmodel.value.maxDate = tmpDate[0];
        break;
      case 'normal':
        vmodel.value.maxDate = null;
        break;
    }
  },
);

const keyupHandler = (e: any) => {
  if (route.path !== '/create') {
    return undefined;
  }

  switch (e.code) {
    case 'Escape':
      router.push('/');
      break;
    case 'NumpadEnter':
    case 'Enter':
      if (e.target.tagName === 'TEXTAREA') {
        return undefined;
      }
      addTask();
      break;
  }
};

onMounted(() => {
  document.body.addEventListener('keyup', keyupHandler);
});
onBeforeUnmount(() => {
  document.body.removeEventListener('keyup', keyupHandler);
});

function addTask() {
  if (!vmodel.value.label) return undefined;

  const res: TaskItem = {
    ...vmodel.value,
    created: new Date().toISOString(),
    closed: false,
    id: Date.now(),
  };

  tasksStore.createTask(res);
  router.push('/');
}

function resetModal(): void {
  vmodel.value.type = 'normal';
  vmodel.value.label = '';
  vmodel.value.info = '';
  vmodel.value.reopen = true;
  vmodel.value.maxDate = null;
  vmodel.value.maxTime = null;
  vmodel.value.timer = false;

  router.push('/');
}
</script>

<style scoped>
.task-create {
  margin: 0 auto;
  margin-bottom: 5px;
  margin-top: 30px;
  padding: 10px;

  color: #2c3e50;
  border: 1px solid #d3d3d34d;
  border-radius: 5px;
  width: 350px;
  background-color: #f5f5f5;
}
</style>
