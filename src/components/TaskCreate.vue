<template>
  <div class="task-create">
    <h4 class="mb2">Создать новую задачу</h4>

    <task-form
      v-model="vmodel">
    </task-form>

    <button class="mr2" @click="addTask">Ок</button>
    <button @click="resetModal">Отмена</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import TaskForm from '@/components/TaskForm.vue';
import ITaskItem from '@/types/ITaskItem';

export default defineComponent({
  name: 'TaskCreate',
  components: {TaskForm},
  data() {
    return {
      vmodel: {
        type: 'normal' as string,
        label: '' as string,
        info: '' as string,
        reopen: true as boolean,
        maxDate: null as string | null,
        maxTime: null as string | null,
        timer: false as boolean
      }
    };
  },
  watch: {
    'vmodel.type': function(val) {
      let tmpDate: string[] = new Date().toJSON().split('T');

      switch(val) {
        case 'hot':
          this.vmodel.maxDate = tmpDate[0];
          break;
        case 'normal':
          this.vmodel.maxDate = null;
          break;
      }
    }
  },
  computed: {
    ...mapGetters('tasks', {
      tasks: 'get_all_tasks'
    })
  },
  methods: {
    ...mapActions('tasks', {
      updateTasks: 'upd_all_tasks'
    }),
    addTask() {
      if(!this.vmodel.label) return undefined;

      let res: ITaskItem[] = [...this.tasks, {
        label: this.vmodel.label,
        type: this.vmodel.type,
        created: new Date().toISOString(),
        closed: false,
        id: Date.now(),
        info: this.vmodel.info,
        reopen: this.vmodel.reopen,
        maxDate: this.vmodel.maxDate,
        maxTime: this.vmodel.maxTime,
        timer: this.vmodel.timer
      }];

      this.updateTasks(res);
      // this.$bvModal.hide('create-task-modal');
    },
    inputTaskForm(i: any) {
      console.log(i, 'i');
      this.vmodel = i;
    },
    resetModal() {
      for (let key in this.vmodel) {
        switch(key) {
          case 'label':
          case 'info':
            this.vmodel[key] = '';
            break;
          case 'timer':
            this.vmodel[key] = false;
            break;
          case 'reopen':
            this.vmodel[key] = true;
            break;
          case 'type':
            this.vmodel[key] = 'normal';
            break;
          case 'maxDate':
          case 'maxTime':
            this.vmodel[key] = null;
            break;
        }
      }
    },
    
  }
})
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