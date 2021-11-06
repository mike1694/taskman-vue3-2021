<template>
  <div class="tasks">
    <TasksComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TasksComponent from '@/components/TasksComponent.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'Tasks',
  components: {
    TasksComponent,
  },
});
</script>
