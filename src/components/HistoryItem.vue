<template>
  <div>
    <div class="history-item" v-if="item.id !== getEditHistory">
      <div class="history-item__header flex-space">
        <div class="history-item__title">
          <span class="bold">{{ date }}</span>
        </div>
        
        <div class="history-item__length flex-center">
          <span class="info-label p4 mr2"
            v-if="item.song_length"
            title="Продолжительность">
            {{ item.song_length }}
          </span>
          <span class="info-label p4 mr2"
            v-if="item.date"
            title="Дата создания">
            {{ new Date(item.date + ' 00:00').toLocaleDateString() }}
          </span>
          <button class="p2" @click="edit">edit</button>
          <button class="p2 history-item__delete" @click="deleteItem">del</button>
        </div>
      </div>
      <h5 class="mb2">{{ item.label ? item.label : '' }}</h5>
      
      <div class="history-item__text text-left primary-label mb2"
        v-if="item.text">
        {{ item.text }}
      </div>

      <div class="history-item__path text-left flex-v-center"
        v-if="item.path"
        @click="copyPathText"
        title="Скопировать путь">
        <span class="bold">
          Путь:&nbsp;
        </span>{{ item.path }} 
        <transition name="fade">
          <span class="ml2 success-label" v-if="copied">
            Путь скопирован!
          </span>
        </transition>
      </div>
    </div>

    <history-form
      :modelValue="item"

      @update:modelValue="editHistory($event)"
      @submit="submit"
      @cancel="cancel"
      v-else>
    </history-form>

    <confirm-dialog
      :visible="!!getConfirmDelete"
      :message="'Удалить запись #' + getConfirmDelete + '?'"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    >
    </confirm-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, PropType } from 'vue';
import { storeToRefs } from 'pinia';
import IHistoryItem from '@/types/IHistoryItem';
import { getFormatDateTime, dateOptions } from '@/api/date_time_format';
import { useHistoryStore } from '@/store/history';
import HistoryForm from '@/components/HistoryForm.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const props = defineProps({
  item: {
    type: Object as PropType<IHistoryItem>,
    required: true
  }
});

const historyStore = useHistoryStore();
const { editHistoryId: getEditHistory, confirmDeleteId: getConfirmDelete } = storeToRefs(historyStore);

const copied = ref(false);
const vmodel = ref<IHistoryItem>({
  type: 'log',
  label: '',
  text: '',
  path: '',
  date: '',
  song_length: '',
  status: 'created'
} as IHistoryItem);

historyStore.toggleHistoryCreate(false);

const date = computed((): string => {
  const res = new Date(props.item.created);

  return getFormatDateTime(res, {
    ...dateOptions,
    year: 'numeric'
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

function editHistory(e: IHistoryItem): void {
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

  setTimeout(() => { copied.value = false; }, 5000);
}
</script>

<style scoped>
  .history-item {
    list-style-type: none;
    margin: 5px;
    padding: 10px;
    border: 1px solid #d3d3d34d;
    border-radius: 5px;
    padding: 10px;
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
