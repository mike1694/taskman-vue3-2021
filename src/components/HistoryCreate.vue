<template>
  <div class="history-create">
    <h4 class="mb2">Создать новую историю</h4>

    <HistoryForm
      :modelValue="vmodel"
      @update:modelValue="vmodel = $event"
      @submit="addHistory"
      @cancel="reset"
    >
    </HistoryForm>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useHistoryStore } from '@/store/history';
import { getDateNow } from '@/api/dateNow';
import type { HistoryItem } from '@/types/HistoryItem';

import HistoryForm from '@/components/HistoryForm.vue';

const route = useRoute();
const historyStore = useHistoryStore();
const { history } = storeToRefs(historyStore);

const vmodel = ref<HistoryItem>({
  type: 'log',
  label: '',
  text: '',
  path: '',
  date: getDateNow(),
  song_length: '',
  status: 'in_process',
} as HistoryItem);

watch(
  () => vmodel.value.path,
  (path) => {
    // create date project autocomplete
    const item = history.value.find(
      (i: HistoryItem) => i.path === path,
    );

    if (item) {
      vmodel.value.date = item.date;
    }
  },
);

historyStore.resetEditHistory();

const keyupHandler = (e: any) => {
  if (route.path !== '/history') {
    return undefined;
  }

  switch (e.code) {
    case 'Escape':
      historyStore.resetEditHistory();
      reset();
      break;
    case 'NumpadEnter':
    case 'Enter':
      if (e.target.tagName === 'TEXTAREA') {
        return undefined;
      }
      addHistory();
      historyStore.toggleHistoryCreate(false);
      break;
  }
};

onMounted(() => {
  document.body.addEventListener('keyup', keyupHandler);
});
onBeforeUnmount(() => {
  document.body.removeEventListener('keyup', keyupHandler);
});

function addHistory() {
  const res: HistoryItem = {
    ...vmodel.value,
    created: new Date().toISOString(),
    id: Date.now(),
  };

  historyStore.createHistory(res);
}

function reset() {
  vmodel.value.type = 'log';
  vmodel.value.label = '';
  vmodel.value.text = '';
  vmodel.value.path = '';
  vmodel.value.date = getDateNow();
  vmodel.value.song_length = '';
  vmodel.value.status = 'in_process';

  historyStore.toggleHistoryCreate(false);
}
</script>

<style scoped>
.history-create {
  width: 500px;
}

@media screen and (max-width: 500px) {
  .history-create {
    width: 350px;
  }
}
</style>
