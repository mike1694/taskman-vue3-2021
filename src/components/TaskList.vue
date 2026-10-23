<template>
  <div :class="className">
    <h5 class="mb2 mt2" v-show="data.length">
      <div class="info-title">
        {{ title }}: {{ data.length }}
      </div>
    </h5>

    <transition-group name="flip-list" tag="ul">
      <li v-for="item in data"
        :key="className + item.id"
        :class="{'edit-task': getEditTask === item.id}">
        <div :class="(getEditTask !== item.id) ? 'edit' : 'cancel'"
            @click="editOnClick(item.id, $event)">
        </div>

        <div class="task-list__delete" @click="deleteTask(item.id)">
          ×
        </div>

        <div  v-if="getEditTask === item.id">
          <h5 class="mb2">Редактирование задачи</h5>
          <task-form
            :key="className + '-form-' + item.id"
            :modelValue="item"

            @update:modelValue="editTask($event)"
          >
          </task-form>
        </div>
                
        <task-item v-else
          :key="className + '-item-' + item.id"
          :item="item"
          @click="handleClick">
        </task-item>
      </li>
    </transition-group>

    <confirm-dialog
      :visible="!!getConfirmDelete"
      :message="'Удалить задачу #' + getConfirmDelete + '?'"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    >
    </confirm-dialog>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { storeToRefs } from 'pinia';
import TaskItem from '@/components/TaskItem.vue';
import TaskForm from '@/components/TaskForm.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { useTasksStore } from '@/store/tasks';
import ITaskItem from '@/types/ITaskItem';

defineProps({
  title: String,
  data: {
    type: Array as PropType<ITaskItem[]>,
    required: true
  },
  className: {
    type: String,
    default: ''
  }
});

const tasksStore = useTasksStore();
const { editTaskId: getEditTask, confirmDeleteId: getConfirmDelete, tasks } = storeToRefs(tasksStore);

function editTask(item: ITaskItem) {
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
      behavior: 'smooth'
    });
  }, 300);
}

function handleClick(id: number) {
  let res = null as ITaskItem | null;

  tasks.value.forEach((i: ITaskItem) => {
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
  transition: .3s;
}

.flip-list-enter {
  transform: translateX(-100px);
  opacity: .3;
}

.flip-list-enter-to {
  transition: .3s;
}

.flip-list-leave-to {
  transform: scale(1.3);
  opacity: .3;
}

@media screen and (max-width: 500px) {
  ul {
    li {
      width: 220px !important;
    }
  }
}

ul {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;

  li {
    list-style-type: none;
    margin-bottom: 5px;
    padding: 10px;
    border: 1px solid #d3d3d34d;
    border-radius: 5px;
    padding: 10px;
    width: 350px;
    // box-shadow: 2px 2px 2px #d3d3d361;
    background-color: #f5f5f5;
    position: relative;

    &.edit-task {
      box-shadow: 0px 0px 10px #d4edda;
      border-color: #d4edda;
    }

    .edit, .cancel {
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
    li:hover .task-list__delete {
      opacity: 1;
    }
    .task-list__delete:hover {
      transform: translateY(-50%) scale(1.3);
    }
    .edit::after, .cancel::after {
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
    .cancel::after {
      background-color: red;
    }
    .edit:hover::after, .cancel:hover::after {
      content: 'edit';
      opacity: 0.5;
      transform: scale(1.2);
    }
    .cancel:hover::after {
      content: 'canc';
    }
  }
}
</style>
