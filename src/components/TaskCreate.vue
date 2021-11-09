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
  mounted() {
    document.body.addEventListener('keyup', this.keyupHandler);
  },
  beforeUnmount() {
    document.body.addEventListener('keyup', this.keyupHandler);
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

      let res: ITaskItem[] = [
        ...this.tasks,
        {
          ...this.vmodel,
          created: new Date().toISOString(),
          closed: false,
          id: Date.now()
        }
      ];

      this.updateTasks(res);
      this.$router.push('/');
    },
    keyupHandler(e: any) {
      if(this.$route.path !== '/create') {
        return undefined;
      }

      console.log(e.code, e.target.tagName, 'e.code');

      switch(e.code) {
        case 'Escape':
          this.$router.push('/');
          break;
        case 'NumpadEnter':
        case 'Enter':
          if(e.target.tagName === "TEXTAREA") {
            return undefined;
          }
          this.addTask();
          break;
        case 'NumpadAdd':
        case 'Equal':
          break;
      }
    },
    resetModal(): void {
      this.vmodel.type = 'normal';
      this.vmodel.label = '';
      this.vmodel.info = '';
      this.vmodel.reopen = true;
      this.vmodel.maxDate = null;
      this.vmodel.maxTime = null;
      this.vmodel.timer = false;

      this.$router.push('/');
    }
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