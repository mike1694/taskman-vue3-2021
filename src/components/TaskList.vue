<template>
  <div :class="className">
    <h5 class="mb-4 mt-4" v-show="data.length">
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

        <div  v-if="getEditTask === item.id">
          <h5>Редактирование задачи</h5>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { mapActions, mapMutations, mapGetters } from 'vuex';
import TaskItem from '@/components/TaskItem.vue';
import TaskForm from '@/components/TaskForm.vue';
import ITaskItem from '@/types/ITaskItem';

export default defineComponent({
  name: 'TaskList',
  components: {
    TaskItem,
    TaskForm
  },
  props: {
    title: String,
    data: {
      type: Array as PropType<ITaskItem[]>,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters('tasks', {
      getEditTask: 'get_edit_task',
      tasks: 'get_all_tasks'
    })
  },
  methods: {
    ...mapMutations('tasks', {
      toggleEditTask: 'toggle_edit_task'
    }),
    ...mapActions('tasks', {
      updateTask: 'upd_task',
    }),
    editTask(item: any) {
      this.updateTask(item);
    },
    editOnClick(id: number, e: any) {
      console.log({id, e});
      if(this.getEditTask !== id) {
        this.scrollTo(e);
      }

      this.toggleEditTask(id);
    },
    scrollTo(el: any) {
      let top = el.target.offsetTop - 200;

      setTimeout(() => {
        window.scroll({
          left: 0,
          top: top,
          behavior: 'smooth'
        });
      }, 300);
    },
    handleClick(id: number) {
      let res = null;
      
      this.tasks.forEach((i: any) => {
        if(i.id === id) {
          i.closed = !i.closed;
          i.closed_date = i.closed ? new Date().toISOString() : null;

          res = i;
        }
      });

      if(!res) return undefined;

      this.updateTask(res);
    }
  }
})
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

    &.edit-task {
      box-shadow: 0px 0px 10px #d4edda;
      border-color: #d4edda;
    }

    .edit, .cancel {
      position: relative;
    }
    .edit::after, .cancel::after {
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