

<template>
  <div class="history-item" v-if="item.id !== getEditHistory">
    <div class="history-item__header flex-space">
      <div class="history-item__title">
        <span class="bold">{{ date }}</span>
      </div>
      
      <div class="history-item__year flex-center">
        <span class="info-label p4 mr2" v-if="item.year">
          {{ item.year }}
        </span>
        <button class="p2" @click="edit">edit</button>
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
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import IHistoryItem from '@/types/IHistoryItem';
import { getFormatDateTime, dateOptions } from '@/api/date_time_format';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import HistoryForm from '@/components/HistoryForm.vue';

export default defineComponent({
  name: 'HistoryItem',
  components: {HistoryForm},
  props: {
    item: {
      type: Object as PropType<IHistoryItem>,
      required: true
    },
  },
  data() {
    return {
      copied: false,
      vmodel: {
        type: 'log',
        label: '',
        text: '',
        path: '',
        year: '',
        status: 'created'
      } as IHistoryItem
    }
  },
  created() {
    this.toggleHistoryCreate(false);
  },
  computed: {
    ...mapGetters('history', {
      getEditHistory: 'get_edit_history',
    }),
    date: function(): string {
      let res = new Date(this.item.created);

      return getFormatDateTime(res, {
        ...dateOptions,
        year: 'numeric'
      });
    },
  },
  methods: {
    ...mapMutations('history', {
      toggleEditHistory: 'toggle_edit_history',
      toggleHistoryCreate: 'toggle_history_create'
    }),
    ...mapActions('history', {
      updateHistory: 'upd_history'
    }),
    submit(): void {
      this.updateHistory(this.vmodel);
    },
    edit() {
      this.toggleEditHistory(this.item.id);
      this.toggleHistoryCreate(false);
    },
    cancel(): void {
      this.toggleEditHistory(this.item.id);
    },
    editHistory(e: IHistoryItem): void {
      this.vmodel = e;
    },

    copyPathText() {
      let input = document.createElement('input');

      input.value = this.item.path;
      document.body.appendChild(input);

      input.select();
      document.execCommand('Copy');
      input.remove();

      this.copied = true;

      setTimeout(() => this.copied = false, 5000);
    }
  }
});
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
</style>
