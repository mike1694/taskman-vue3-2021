<template>
  <div class="history-component">

    <div class="history-list">
      <history-item
        v-for="(item, key) in history"
        :item="item"
        :key="key">
      </history-item>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import HistoryItem from '@/components/HistoryItem.vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'HistoryComponent',
  components: {HistoryItem},
  computed: {
    ...mapGetters('history', {
      history: 'get_all_history'
    }),
  }
});
</script>

<style scoped>
  
</style>
