<template>
  <div class="tasks">
    <TasksComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TasksComponent from '@/components/TasksComponent.vue';
import TasksKeyup from '@/vueMixins/TasksKeyup.vue';

export default defineComponent({
  name: 'Tasks',
  mixins: [TasksKeyup],
  components: {
    TasksComponent
  }
});
</script>
