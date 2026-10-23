<template>
  <h4 class="history-header">
    История |
    <button class="text-right p4" @click="toggleHistoryCreate(true)">
      Добавить историю
    </button>
  </h4>

  <div class="history-component">
    <HistoryCreate v-if="showHistoryCreate"> </HistoryCreate>

    <div class="history-list mb4">
      <HistoryItemComponent
        v-for="(item, key) in historySorted"
        :item="item"
        :key="key"
      >
      </HistoryItemComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useHistoryStore } from '@/store/history';
import type { HistoryItem } from '@/types/HistoryItem';

import HistoryItemComponent from '@/components/HistoryItem.vue';
import HistoryCreate from '@/components/HistoryCreate.vue';

const historyStore = useHistoryStore();
const { history, showHistoryCreate } = storeToRefs(historyStore);

const historySorted = computed<HistoryItem[]>(() => {
  return history.value.toSorted(
    (a: HistoryItem, b: HistoryItem) => b.id - a.id,
  );
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
