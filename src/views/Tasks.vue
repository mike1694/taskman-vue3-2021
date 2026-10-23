<template>
  <div class="tasks">
    <TasksComponent />
  </div>
</template>

<script setup lang="ts">
import TasksComponent from '@/components/TasksComponent.vue';
import useTasksKeyup from '@/composables/useTasksKeyup';

useTasksKeyup();
</script>
