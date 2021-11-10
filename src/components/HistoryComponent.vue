<template>
  <h4>История</h4>

  <div class="history-component flex-h-center">

    <div class="history-list">
      <history-item
        v-for="(item, key) in historySorted"
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
import IHistoryItem from '@/types/IHistoryItem';

export default defineComponent({
  name: 'HistoryComponent',
  components: {HistoryItem},
  computed: {
    ...mapGetters('history', {
      history: 'get_all_history'
    }),
    historySorted: function(): IHistoryItem[] {
      return [...this.history as IHistoryItem[]]
        .sort((a, b) => b.id - a.id);
    }
  }
});
</script>

<style scoped>
.history-list {
  width: 500px;
}
</style>
