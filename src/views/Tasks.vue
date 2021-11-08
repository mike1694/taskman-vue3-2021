<template>
  <div class="tasks">
    <TasksComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TasksComponent from '@/components/TasksComponent.vue';
import TasksRouteKeyup from '@/vueMixins/TasksRouteKeyup.vue';

export default defineComponent({
  name: 'Tasks',
  mixins: [TasksRouteKeyup],
  components: {
    TasksComponent
  }
});
</script>
