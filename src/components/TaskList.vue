<template>
  <div :class="['task-list', props.className]">
    <h5 v-show="props.data.length" class="mb2 mt2">
      <div class="info-title">
        {{ props.title }}: {{ props.data.length }}
      </div>
    </h5>

    <transition-group
      name="flip-list"
      tag="ul"
      class="task-list__list"
    >
      <li
        v-for="item in data"
        :key="props.className + item.id"
        :class="{ 'task-list__item--edit': getEditTask === item.id }"
        class="task-list__item"
      >
        <div
          :class="
            getEditTask !== item.id
              ? 'task-list__edit'
              : 'task-list__edit--cancel'
          "
          @click="editOnClick(item.id, $event)"
        ></div>

        <div class="task-list__delete" @click="deleteTask(item.id)">
          ×
        </div>

        <div v-if="getEditTask === item.id">
          <h5 class="mb2">Редактирование задачи</h5>

          <TaskForm
            :key="props.className + '-form-' + item.id"
            :modelValue="item"
            @update:modelValue="editTask($event)"
          >
          </TaskForm>
        </div>

        <TaskItemComponent
          v-else
          :key="props.className + '-item-' + item.id"
          :item="item"
          @click="handleClick"
        >
        </TaskItemComponent>
      </li>
    </transition-group>

    <ConfirmDialog
      :visible="getConfirmVisible"
      :message="'Удалить задачу «' + getConfirmTitle + '»?'"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    >
    </ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useTasksStore } from '@/store/tasks';
import type { TaskItem } from '@/types/TaskItem';

import TaskItemComponent from '@/components/TaskItem.vue';
import TaskForm from '@/components/TaskForm.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    data: TaskItem[];
    className?: string;
  }>(),
  {
    className: '',
  },
);

const tasksStore = useTasksStore();
const {
  editTaskId: getEditTask,
  confirmDeleteId: getConfirmDelete,
  tasks,
} = storeToRefs(tasksStore);

const getConfirmVisible = computed((): boolean => {
  return (
    getConfirmDelete.value !== null &&
    props.data.some((i) => i.id === getConfirmDelete.value)
  );
});

const getConfirmTitle = computed((): string => {
  const item = props.data.find(
    (i) => i.id === getConfirmDelete.value,
  );

  return item ? item.label : '';
});

function editTask(item: TaskItem) {
  if (item.type === 'hot' && !item.maxDate) return;

  tasksStore.updateTask(item);
}

function editOnClick(id: number, e: any) {
  if (getEditTask.value !== id) {
    scrollTo(e);
  }

  tasksStore.toggleEditTask(id);
}

function scrollTo(el: any) {
  const top = el.target.offsetTop - 200;

  setTimeout(() => {
    window.scroll({
      left: 0,
      top: top,
      behavior: 'smooth',
    });
  }, 300);
}

function handleClick(id: number) {
  let res = null as TaskItem | null;

  tasks.value.forEach((i: TaskItem) => {
    if (i.id === id) {
      i.closed = !i.closed;
      i.closed_date = i.closed ? new Date().toISOString() : null;

      res = i;
    }
  });

  if (!res) return undefined;

  tasksStore.updateTask(res);
}

function deleteTask(id: number) {
  tasksStore.deleteTask(id);
}

function confirmDelete() {
  tasksStore.confirmDelete();
}

function cancelDelete() {
  tasksStore.cancelDelete();
}
</script>

<style scoped lang="scss">
.flip-list-move {
  transition: 0.3s;
}

.flip-list-enter {
  transform: translateX(-100px);
  opacity: 0.3;
}

.flip-list-enter-to {
  transition: 0.3s;
}

.flip-list-leave-to {
  transform: scale(1.3);
  opacity: 0.3;
}

@media screen and (max-width: 500px) {
  .task-list__list {
    .task-list__item {
      width: 220px !important;
    }
  }
}

.task-list__list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;

  .task-list__item {
    list-style-type: none;
    margin-bottom: 5px;
    padding: 10px;
    border: 1px solid #d3d3d34d;
    border-radius: 5px;
    width: 350px;
    // box-shadow: 2px 2px 2px #d3d3d361;
    background-color: #f5f5f5;
    position: relative;

    &.task-list__item--edit {
      box-shadow: 0px 0px 10px #d4edda;
      border-color: #d4edda;
    }

    .task-list__edit,
    .task-list__edit--cancel {
      position: relative;
    }
    .task-list__delete {
      position: absolute;
      right: -12px;
      top: 0;
      transform: translateY(-50%);
      color: #dc3545;
      font-size: 22px;
      font-weight: bold;
      cursor: pointer;
      opacity: 0.4;
      transition: 0.3s;
      padding: 5px;
      line-height: 1;
      z-index: 10;
    }
    &:hover .task-list__delete {
      opacity: 1;
    }
    .task-list__delete:hover {
      transform: translateY(-50%) scale(1.3);
    }
    .task-list__edit::after,
    .task-list__edit--cancel::after {
      overflow: hidden;
      content: '';
      font-size: 10px;
      background-size: 20px 20px;
      width: 10px;
      height: 10px;
      justify-content: center;
      display: flex;
      text-align: center;
      position: absolute;
      background-repeat: no-repeat;
      background-position: center;
      align-items: center;
      right: -66px;
      top: -11px;
      color: white;
      cursor: pointer;
      border-radius: 4px;
      padding: 13px;
      opacity: 0.2;
      background-color: #17a2b8;
      transition: 0.3s;
    }
    .task-list__edit--cancel::after {
      background-color: red;
    }
    .task-list__edit:hover::after,
    .task-list__edit--cancel:hover::after {
      content: 'edit';
      opacity: 0.5;
      transform: scale(1.2);
    }
    .task-list__edit--cancel:hover::after {
      content: 'canc';
    }
  }
}
</style>
