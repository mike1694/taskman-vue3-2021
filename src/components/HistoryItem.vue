<template>
  <div>
    <div v-if="props.item.id !== getEditHistory" class="history-item">
      <div class="history-item__header flex-space">
        <div class="history-item__title">
          <span class="bold">{{ date }}</span>
        </div>

        <div class="history-item__length flex-center">
          <span
            v-if="props.item.song_length"
            class="info-label p4 mr2"
            title="Продолжительность"
          >
            {{ props.item.song_length }}
          </span>

          <span
            v-if="props.item.date"
            class="info-label p4 mr2"
            title="Дата создания"
          >
            {{
              new Date(
                props.item.date + ' 00:00',
              ).toLocaleDateString()
            }}
          </span>

          <button class="btn p2" @click="edit">edit</button>

          <button
            class="btn p2 history-item__delete"
            @click="deleteItem"
          >
            del
          </button>
        </div>
      </div>
      <h5 class="mb2">
        {{ props.item.label ? props.item.label : '' }}
      </h5>

      <div
        v-if="props.item.text"
        class="history-item__text text-left primary-label mb2"
      >
        {{ props.item.text }}
      </div>

      <div
        v-if="props.item.path"
        class="history-item__path text-left flex-v-center"
        title="Скопировать путь"
        @click="copyPathText"
      >
        <span class="bold"> Путь:&nbsp; </span>{{ props.item.path }}

        <transition name="fade">
          <span v-if="copied" class="ml2 success-label">
            Путь скопирован!
          </span>
        </transition>
      </div>
    </div>

    <HistoryForm
      v-else
      :modelValue="props.item"
      @update:modelValue="editHistory($event)"
      @submit="submit"
      @cancel="cancel"
    >
    </HistoryForm>

    <ConfirmDialog
      :visible="getConfirmDelete === props.item.id"
      :message="'Удалить запись «' + props.item.label + '»?'"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    >
    </ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

import type { HistoryItem } from '@/types/HistoryItem';
import { getFormatDateTime, dateOptions } from '@/api/dateTimeFormat';
import { useHistoryStore } from '@/store/history';

import HistoryForm from '@/components/HistoryForm.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const props = defineProps<{
  item: HistoryItem;
}>();

const historyStore = useHistoryStore();
const {
  editHistoryId: getEditHistory,
  confirmDeleteId: getConfirmDelete,
} = storeToRefs(historyStore);

const copied = ref(false);
const vmodel = ref<HistoryItem>({
  type: 'log',
  label: '',
  text: '',
  path: '',
  date: '',
  song_length: '',
  status: 'created',
} as HistoryItem);

historyStore.toggleHistoryCreate(false);

const date = computed((): string => {
  const res = new Date(props.item.created);

  return getFormatDateTime(res, {
    ...dateOptions,
    year: 'numeric',
  });
});

function submit(): void {
  historyStore.updateHistory(vmodel.value);
  historyStore.resetEditHistory();
}

function edit() {
  historyStore.toggleEditHistory(props.item.id);
  historyStore.toggleHistoryCreate(false);
}

function deleteItem() {
  historyStore.deleteHistory(props.item.id);
}

function cancel(): void {
  historyStore.toggleEditHistory(props.item.id);
}

function editHistory(e: HistoryItem): void {
  vmodel.value = e;
}

function confirmDelete() {
  historyStore.confirmDelete();
}

function cancelDelete() {
  historyStore.cancelDelete();
}

function copyPathText() {
  const input = document.createElement('input');

  input.value = props.item.path;
  document.body.appendChild(input);

  input.select();
  document.execCommand('Copy');
  input.remove();

  copied.value = true;

  setTimeout(() => {
    copied.value = false;
  }, 5000);
}
</script>

<style scoped>
.history-item {
  list-style-type: none;
  margin: 5px;
  padding: 10px;
  border: 1px solid #d3d3d34d;
  border-radius: 5px;
  background-color: #f5f5f5;
}

.history-item__text {
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 16px;
}

.history-item__title {
  color: #2c3e50c2;
  font-size: 12px;
}

.history-item__path {
  font-size: 13px;
  cursor: context-menu;
}

.history-item__delete {
  margin-left: 4px;
  color: #dc3545;
  background: none;
  border: 1px solid #dc3545;
  cursor: pointer;
  transition: 0.3s;
}

.history-item__delete:hover {
  background: #dc3545;
  color: white;
}
</style>
