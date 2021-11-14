<template>
  <h4 class="history-header">История | 
    <button class="text-right p4"
      @click="toggleHistoryCreate(true)">
        Добавить историю
    </button>
  </h4>

  <div class="history-component">
    <history-create
      v-if="showHistoryCreate">
    </history-create>

    <div class="history-list mb4">
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
import HistoryCreate from '@/components/HistoryCreate.vue';
import { mapGetters, mapMutations, mapState } from 'vuex';
import IHistoryItem from '@/types/IHistoryItem';

export default defineComponent({
  name: 'HistoryComponent',
  components: {HistoryItem, HistoryCreate},
  computed: {
    ...mapState('history', {
      showHistoryCreate: 'show_history_create',
    }),
    ...mapGetters('history', {
      history: 'get_all_history',
    }),
    historySorted: function(): IHistoryItem[] {
      return [...this.history as IHistoryItem[]]
        .sort((a, b) => b.id - a.id);
    }
  },
  methods: {
    ...mapMutations('history', {
      toggleHistoryCreate: 'toggle_history_create'
    })
  }
});
</script>

<style scoped>
.history-component {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.history-list {
  width: 500px;
}
</style>
