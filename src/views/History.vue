<template>
  <div class="history">
    <h4>История</h4>

    <HistoryComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HistoryComponent from '@/components/HistoryComponent.vue';
// import TasksKeyup from '@/vueMixins/TasksKeyup.vue';

export default defineComponent({
  name: 'History',
  // mixins: [TasksKeyup],
  components: {
    HistoryComponent
  }
});
</script>
