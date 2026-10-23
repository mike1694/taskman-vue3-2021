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

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import HistoryItem from '@/components/HistoryItem.vue';
import HistoryCreate from '@/components/HistoryCreate.vue';
import { useHistoryStore } from '@/store/history';
import IHistoryItem from '@/types/IHistoryItem';

const historyStore = useHistoryStore();
const { history, showHistoryCreate } = storeToRefs(historyStore);

const historySorted = computed<IHistoryItem[]>(() => {
  return [...history.value]
    .sort((a: IHistoryItem, b: IHistoryItem) => b.id - a.id);
});

function toggleHistoryCreate(payload: boolean) {
  historyStore.toggleHistoryCreate(payload);
}
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

@media screen and (max-width: 500px) {
  .history-list {
    width: 350px;
  }
}
</style>
