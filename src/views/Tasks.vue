<template>
  <div class="tasks">
    <TasksComponent />
  </div>
</template>

<script setup lang="ts">
import { useTasksKeyup } from '@/composables/useTasksKeyup';

import TasksComponent from '@/components/TasksComponent.vue';

useTasksKeyup();
</script>
