<template>
  <div class="create">
    <TaskCreate />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TaskCreate from '@/components/TaskCreate.vue';

export default defineComponent({
  name: 'Create',
  components: {
    TaskCreate,
  },
});
</script>